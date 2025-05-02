import { cookies } from "next/headers";
import { verifyCustomJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("custom_jwt")?.value;

  if (!cookie)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = verifyCustomJWT(cookie);
  if (!userId)
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
