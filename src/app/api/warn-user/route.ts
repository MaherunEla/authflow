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
      subject: "You've been warned",
      html: `<p>Hello,</p><p>You have received a warning for the following reason:</p><blockquote>${reason}</blockquote><p>Please be careful next time.</p>`,
    });

    const users = await prisma.user.update({
      where: { email },
      data: { warningReason: reason, status: "WARNED" },
    });

    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        actionTargetType: "USER_MANAGEMENT",
        targetId: users.id,
        actionType: "WARN_USER",
        notes: reason || "",
      },
    });
    return NextResponse.json({ message: "Warning email sent!", data });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { message: "Failed to send warning email" },
      { status: 500 }
    );
  }
}
