import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);
export async function POST(req: NextRequest) {
  try {
    const { email, reason } = await req.json();

    const data = await resend.emails.send({
      from: "Admin Team <onboarding@resend.dev>",
      to: email,
      subject: "You've been Suspend",
      html: `<p>Hello,</p><p>You have Suspend for the following reason:</p><blockquote>${reason}</blockquote><p>Please be careful next time.</p>`,
    });

    await prisma.user.update({
      where: { email },
      data: { suspendReason: reason, status: "SUSPENDED" },
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
