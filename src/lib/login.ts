import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { createTempToken } from "./tempToken";
import jwt from "jsonwebtoken";
import * as UAParser from "ua-parser-js";
import { getLocationFromIP } from "./ip";

const SECRET_KEY = process.env.JWT_SECRET || "helloela";

//Input validation

export const validateLoginInput = (email?: string, password?: string) => {
  if (!email || !password) return false;
  return true;
};

// Check user credentials

export const checkUserCredentials = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  if (user.status === "SUSPENDED" || user.status === "LOCKED") return "blocked";

  const isValidPassword = user.password
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!isValidPassword) return "wrong_password";

  return user;
};

// Handle 2FA

export const handleTwoFA = (user: any) => {
  if (user.twoFaEnabled) {
    const tempToken = createTempToken(user.id);
    return {
      twoFARequired: true,
      tempToken,
      user: { id: user.id, email: user.email },
    };
  }
  return null;
};

// Generate JWT

export const generateJWT = (user: any) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

// Track device and suspicious activity

export const trackDeviceAndSuspiciousActivity = async (
  user: any,
  fingerprint: string | undefined,
  ip: string,
  userAgent: string
) => {
  const parser = new UAParser.UAParser();
  parser.setUA(userAgent);
  const browser = parser.getBrowser().name ?? "Unknown Browser";
  const os = parser.getOS().name ?? "Unknown OS";
  const deviceName = `${browser} on ${os}`;
  const location = await getLocationFromIP(ip);

  const device = fingerprint
    ? await prisma.device.findFirst({
        where: { userId: user.id, fingerprint },
      })
    : null;

  const hasAnyDevice = await prisma.device.findFirst({
    where: {
      userId: user.id,
    },
  });

  let deviceId;
  if (!hasAnyDevice) {
    const createdDevice = await prisma.device.create({
      data: {
        userId: user.id,
        name: deviceName,
        fingerprint: fingerprint || "",
        ip,
        location,
        userAgent,
        lastUsedAt: new Date(),
        trusted: true,
      },
    });
    deviceId = createdDevice.id;
  } else if (device) {
    if (device.ip !== ip || device.location !== location) {
      await prisma.$transaction([
        prisma.suspiciousActivity.create({
          data: {
            userId: user.id,
            type: "IP_OR_LOCATION_CHANGE",
            ip,
            location,
            userAgent,
          },
        }),
        prisma.device.update({
          where: { id: device.id },
          data: { ip, location, lastUsedAt: new Date() },
        }),
      ]);
    } else {
      await prisma.device.update({
        where: { id: device.id },
        data: { lastUsedAt: new Date() },
      });
    }
    deviceId = device.id;
  } else {
    const [, createdDevice] = await prisma.$transaction([
      prisma.suspiciousActivity.create({
        data: { userId: user.id, type: "NEW_DEVICE", ip, location, userAgent },
      }),
      prisma.device.create({
        data: {
          userId: user.id,
          name: deviceName,
          fingerprint: fingerprint || "",
          ip,
          location,
          userAgent,
          lastUsedAt: new Date(),
        },
      }),
    ]);
    deviceId = createdDevice.id;
  }

  // Multi-session detection
  const activeSessions = await prisma.session.findMany({
    where: {
      userId: user.id,
      expiresAt: { gt: new Date() },
    },
  });

  const uniqueDevices = new Set(activeSessions.map((s) => s.deviceId || s.ip));

  if (uniqueDevices.size > 1) {
    await prisma.suspiciousActivity.create({
      data: { userId: user.id, type: "MULTI_SESSION", ip, location, userAgent },
    });
  }

  // Update last login info
  await prisma.user.update({
    where: { email: user.email },
    data: {
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    },
  });

  return { deviceId, location };
};

// Create session

export const createSession = async (
  user: any,
  deviceId: string,
  ip: string,
  userAgent: string,
  location: string
) => {
  return prisma.session.create({
    data: {
      userId: user.id,
      ip,
      userAgent,
      location,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      deviceId,
    },
  });
};
