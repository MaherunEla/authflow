import { getServerSessionUnified } from "@/lib/getServerSessionUnified";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, actionTargetType, notes } = await req.json();
    const session = await getServerSessionUnified();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resent = await prisma.user.update({
      where: { id: id },
      data: {
        twoFaSecret: null,
        twoFaEnabled: false,
      },
    });

    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        actionTargetType,
        targetId: id,
        actionType: "TWOFA_RESET",
        notes,
      },
    });

    return NextResponse.json({ resent });
  } catch (error) {
    console.error("2FA setup error", error);
    return NextResponse.json(
      { error: "Failed to enalbe 2FA" },
      { status: 500 }
    );
  }
}
