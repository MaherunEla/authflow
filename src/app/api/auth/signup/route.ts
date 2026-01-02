import { NextResponse } from "next/server";

import { signupUser } from "@/lib/signup";

export const POST = async (req: Request) => {
  try {
    const { name, email, password } = await req.json();

    const newUser = await signupUser({ name, email, password });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "VALIDATION_ERROR") {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 }
      );
    }
    if (error.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
