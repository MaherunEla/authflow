import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSessionUnified } from "@/lib/getServerSessionUnified";

const resend = new Resend(process.env.RESEND_API_KEY!);
export async function POST(req: NextRequest) {
  try {
    const { id, email, alert } = await req.json();
    const session = await getServerSessionUnified();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await resend.emails.send({
      from: "Admin Team <onboarding@resend.dev>",
      to: email,
      subject: "Suspicious Activity Detected on Your Account",
      html: `<p>Hello,</p><p>${alert}<p>If this was you, no action is needed. If you do not recognize this activity, we strongly recommend you secure your account immediately by changing your password.</p>
         <p>Stay safe,<br/>The Admin Team</p>`,
    });

    const users = await prisma.suspiciousActivity.update({
      where: { id },
      data: { actionTaken: "Send Alert" },
    });

    await prisma.adminActionLog.create({
      data: {
        adminId: session.user.id,
        actionTargetType: "SUSPICIOUS_ACTIVITY",
        targetId: users.userId,
        actionType: "SEND_ALERT",
        notes: alert,
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
