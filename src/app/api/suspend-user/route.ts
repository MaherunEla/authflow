import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";

const resend = new Resend(process.env.RESEND_API_KEY!);
export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();
    const session = await getServerSessionUnified();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await resend.emails.send({
      from: "Admin Team <onboarding@resend.dev>",
      to: email,
      subject: "You've been Suspend",
      html: `<p>Hello,</p><p>You have Suspend for the following reason:</p><blockquote>${reason}</blockquote><p>Please be careful next time.</p>`,
    });

    const users = await prisma.user.update({
      where: { email },
      data: { suspendReason: reason, status: "SUSPENDED" },
    });

    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        actionTargetType: "USER_MANAGEMENT",
        targetId: users.id,
        actionType: "SUSPEND_USER",
        notes: reason || "",
      },
    });
    return NextResponse.json({ message: "Suspend email sent!", data });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { message: "Failed to send warning email" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSessionUnified();

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, actionTargetType, tableid } = await req.json();

    const deletesession = await prisma.session.deleteMany({
      where: {
        userId: id as string,
      },
    });

    if (actionTargetType === "SUSPICIOUS_ACTIVITY") {
      await prisma.suspiciousActivity.update({
        where: { id: tableid as string },
        data: { actionTaken: "Force Logout" },
      });
    }

    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        actionTargetType,
        targetId: id,
        actionType: "FORCE_LOGOUT",
        notes: "",
      },
    });
    return NextResponse.json(deletesession);
  } catch (error) {
    console.error("Delete session error", error);
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}
