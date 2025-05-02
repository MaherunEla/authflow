import { prisma } from "@/lib/prisma";

import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { createTempToken } from "@/lib/tempToken";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    const secret = speakeasy.generateSecret({ name: "AuthFlow" });

    const qr = await QRCode.toDataURL(secret.otpauth_url!);

    const tempToken = createTempToken(id);

    await prisma.user.update({
      where: { id: id },
      data: {
        twoFaSecret: secret.base32,
        twoFaEnabled: true,
      },
    });
    return Response.json({ qr, tempToken });
  } catch (error) {
    console.error("2FA setup error", error);
    return Response.json({ error: "Failed to enalbe 2FA" }, { status: 500 });
  }
}
