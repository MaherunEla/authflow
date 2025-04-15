import { prisma } from "@/lib/prisma";

import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const secret = speakeasy.generateSecret({ name: "AuthFlow" });

    const qr = await QRCode.toDataURL(secret.otpauth_url!);

    await prisma.user.update({
      where: { id: id },
      data: {
        twoFaSecret: secret.base32,
        twoFaEnabled: true,
      },
    });
    return Response.json({ qr, otpauth_url: secret.otpauth_url });
  } catch (error) {
    console.error("2FA setup error", error);
    return Response.json({ error: "Failed to enalbe 2FA" }, { status: 500 });
  }
}
