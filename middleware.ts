import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/lib";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const updatedResponse = await updateSession(request, response);
  return updatedResponse;
}
