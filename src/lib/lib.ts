import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SessionPayload } from "../../types/authTypes";
import speakeasy from "speakeasy";
import { prisma } from "./prisma";
import { LoginStatus } from "@prisma/client";
import { LogLoginAttempt } from "./logLoginAttempt";
import * as UAParser from "ua-parser-js";
import { getLocationFromIP } from "./ip";
import { redirect } from "next/navigation";
import { JWTExpired } from "jose/errors";

const key = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function encrypt(payload: SessionPayload) {
  const expSeconds = Math.floor(payload.expires.getTime() / 1000);
  const flatPayload = {
    ...payload.user,
    expires: payload.expires.toISOString(),
  };
  return await new SignJWT(flatPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expSeconds)
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    const session: SessionPayload = {
      user: {
        id: payload.id as string,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string,
        twoFaEnabled: payload.twoFaEnabled as boolean,
      },
      expires: new Date(payload.expires as string),
    };
    return session;
  } catch (error) {
    if (error instanceof JWTExpired) {
      console.warn("JWT expired");
    } else {
      console.error("JWT verification failed:", error);
    }

    return null;
  }
}

type RequestMeta = {
  ip: string;
  userAgent: string;
};

export async function login(formData: FormData, meta: RequestMeta) {
  const step = formData.get("step") || "credentials";
  if (step === "credentials") {
    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
      fingerprint: formData.get("fingerprint"),
    };
    if (!user.email || !user.password) {
      return { error: "Invalid email or password" };
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          fingerprint: user.fingerprint,
        }),
      }
    );
    console.log({ res });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.error || "Invalid email or password" };
    }

    if (!data.user) {
      return { error: "User not found" };
    }

    if (data.twoFARequired) {
      return {
        requires2FA: true,
        userId: data.user.id,
        tempToken: data.tempToken,
      };
    }
    //create session
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const custom_jwt = await encrypt({ user: data.user, expires });

    return { custom_jwt };
  }

  if (step === "2fa") {
    const userId = formData.get("userId") as string;
    const token = formData.get("token") as string;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.twoFaSecret) return { error: "Invalid 2FA setup" };

    const verified = speakeasy.totp.verify({
      secret: user.twoFaSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      await LogLoginAttempt({
        email: user.email || "Unknown or missing",
        success: LoginStatus.FAILURE,
        reason: "Invalid 2FA code",
        userAgent: meta.userAgent,
        ip: meta.ip,
      });
      return { error: "Invalid 2FA code" };
    }
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    const custom_jwt = await encrypt({ user, expires });

    const parser = new UAParser.UAParser();
    parser.setUA(meta.userAgent);
    const browser = parser.getBrowser().name || "Unknown Browser";
    const os = parser.getOS().name || "Unknown OS";
    const deviceName = `${browser} on ${os}`;

    await LogLoginAttempt({
      email: user.email,
      success: LoginStatus.SUCCESS,
      reason: "Log in Successful",
      userAgent: meta.userAgent,
      ip: meta.ip,
    });

    let device = await prisma.device.findFirst({
      where: {
        userId: user.id,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    });

    if (!device) {
      device = await prisma.device.create({
        data: {
          userId: user.id,
          name: deviceName,
          fingerprint: (formData.get("fingerprint") as string) || "",
          ip: meta.ip,
          location: await getLocationFromIP(meta.ip),
          userAgent: meta.userAgent,
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
        ip: meta.ip,
        userAgent: meta.userAgent,
        location: await getLocationFromIP(meta.ip),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        deviceId: device.id,
      },
    });

    await prisma.user.update({
      where: { email: user.email },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: meta.ip,
      },
    });

    return { custom_jwt };
  }

  // //save the session in a cookie
  // const cookieStore = await cookies();
  // cookieStore.set("custom_jwt", custom_jwt, { expires, httpOnly: true });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("custom_jwt", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });

  // Optionally clear NextAuth cookies if you're using OAuth
  cookieStore.set("next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  cookieStore.set("__Secure-next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  redirect("/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const custom_jwt = cookieStore.get("custom_jwt")?.value;
  if (!custom_jwt) return null;
  return await decrypt(custom_jwt);
}

export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const token = request.cookies.get("custom_jwt")?.value;

  if (!token) return response;

  try {
    const session = await decrypt(token);
    if (!session) {
      response.cookies.delete("custom_jwt");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const now = new Date();
    const expires = new Date(session.expires);

    if (expires < now) {
      response.cookies.delete("custom_jwt");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    session.expires = new Date(now.getTime() + 60 * 60 * 1000);
    const newToken = await encrypt(session);

    response.cookies.delete("custom_jwt");

    response.cookies.set("custom_jwt", newToken, {
      httpOnly: true,
      expires: session.expires,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("Session error:", err);
    response.cookies.delete("custom_jwt");
    return response;
  }
}
