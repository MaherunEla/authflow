import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "logged out" });

  response.cookies.set("custom_jwt", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  response.cookies.set("next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  response.cookies.set("_Secure-next-auth.session-token", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  return response;
}
