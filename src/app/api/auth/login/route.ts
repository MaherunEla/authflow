import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createTempToken } from "@/lib/tempToken";

const SECRET_KEY = process.env.JWT_SECRET || "helloela";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { erro: "Invaild email or password" },
        { status: 400 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
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
