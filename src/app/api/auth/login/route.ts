import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createTempToken } from "@/lib/tempToken";
import { LogLoginAttempt } from "@/lib/logLoginAttempt";
import { LoginStatus } from "@prisma/client";
import { getLocationFromIP } from "@/lib/ip";
import * as UAParser from "ua-parser-js";

const SECRET_KEY = process.env.JWT_SECRET || "helloela";

export const POST = async (req: Request) => {
  try {
    const { email, password, fingerprint } = await req.json();

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";

    if (!email || !password) {
      await LogLoginAttempt({
        email: email || "unknown",
        success: LoginStatus.FAILURE,
        reason: "Missing email or password",
        userAgent,
        ip,
      });

      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await LogLoginAttempt({
        email: email || "unknown",
        success: LoginStatus.FAILURE,
        reason: "Invalid email or password",
        userAgent,
        ip,
      });
      return NextResponse.json(
        { erro: "Invaild email or password" },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await LogLoginAttempt({
        email: email || "unknown",
        success: LoginStatus.FAILURE,
        reason: "Invalid  password",
        userAgent,
        ip,
      });
      return NextResponse.json({ error: "Invalid  password" }, { status: 400 });
    }

    if (user.twoFaEnabled) {
      const tempToken = createTempToken(user.id);
      return Response.json({
        twoFARequired: true,
        tempToken,
        user: { id: user.id, email: user.email },
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    await LogLoginAttempt({
      email: email,
      success: LoginStatus.SUCCESS,
      reason: "Log in Successful",
      userAgent,
      ip,
    });

    const parser = new UAParser.UAParser();
    parser.setUA(userAgent);
    const browser = parser.getBrowser().name || "Unknown Browser";
    const os = parser.getOS().name || "Unknown OS";
    const deviceName = `${browser} on ${os}`;

    let device = await prisma.device.findFirst({
      where: {
        userId: user.id,
        ip,
        userAgent,
      },
    });

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: user.id,
          name: deviceName,
          fingerprint: fingerprint || "",
          ip,
          location: await getLocationFromIP(ip),
          userAgent,
          lastUsedAt: new Date(),
        },
      });
    } else {
      await prisma.device.update({
        where: { id: device.id },
        data: { lastUsedAt: new Date() },
      });
    }

    await prisma.session.create({
      data: {
        userId: user.id,
        ip,
        userAgent,
        location: await getLocationFromIP(ip),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        deviceId: device.id,
      },
    });

    return NextResponse.json(
      {
        message: "Login successfull",
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
