import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createTempToken } from "@/lib/tempToken";
import { LogLoginAttempt } from "@/lib/logLoginAttempt";
import { LoginStatus } from "@prisma/client";

const SECRET_KEY = process.env.JWT_SECRET || "helloela";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      await LogLoginAttempt({
        email: email || "unknown",
        success: LoginStatus.FAILURE,
        reason: "Missing email or password",
        request: req,
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
        request: req,
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
        request: req,
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
      expiresIn: "7d",
    });

    await LogLoginAttempt({
      email: email,
      success: LoginStatus.SUCCESS,
      reason: "Log in Successful",
      request: req,
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
