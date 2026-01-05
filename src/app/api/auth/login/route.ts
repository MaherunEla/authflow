import { NextResponse } from "next/server";

import { LogLoginAttempt } from "@/lib/logLoginAttempt";
import { LoginStatus } from "@prisma/client";

import {
  checkUserCredentials,
  createSession,
  generateJWT,
  handleTwoFA,
  trackDeviceAndSuspiciousActivity,
  validateLoginInput,
} from "@/lib/login";

export const POST = async (req: Request) => {
  try {
    const { email, password, fingerprint } = await req.json();

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "";

    // Validate input

    if (!validateLoginInput(email, password)) {
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

    // Check user credentials
    const user = await checkUserCredentials(email!, password!);
    if (user === null || user === "wrong_password") {
      await LogLoginAttempt({
        email: email || "unknown",
        success: LoginStatus.FAILURE,
        reason: "Invalid email or password",
        userAgent,
        ip,
      });
      return NextResponse.json(
        { error: "Invaild email or password" },
        { status: 400 }
      );
    }

    if (user === "blocked") {
      return NextResponse.json(
        { error: "Your account is currently not allowed to log in" },
        { status: 400 }
      );
    }

    // 2FA check
    const twoFA = handleTwoFA(user);
    if (twoFA) return NextResponse.json(twoFA);

    // Generate JWT

    const token = generateJWT(user);

    //Track device / suspicious activity
    const { deviceId, location } = await trackDeviceAndSuspiciousActivity(
      user,
      fingerprint!,
      ip,
      userAgent
    );

    // Create session
    await createSession(user, deviceId, ip, userAgent, location);

    await LogLoginAttempt({
      email: email,
      success: LoginStatus.SUCCESS,
      reason: "Log in Successful",
      userAgent,
      ip,
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
