import { NextResponse } from "next/server";

import { signupUser } from "@/lib/signup";
import { AppError } from "@/lib/errors/AppError";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();

    const newUser = await signupUser({ name, email, password });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error("Unexpected Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
