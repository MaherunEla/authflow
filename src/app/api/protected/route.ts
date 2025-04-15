import { NextRequest, NextResponse } from "next/server";
import { authmiddleware } from "@/middlewares/authMiddleware";

export async function GET(req: NextRequest) {
  const res = authmiddleware(req);
  if (res) return res;

  return NextResponse.json({ message: "Protected API accessed!" });
}
