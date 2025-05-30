"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TwoFactorSetup() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [tempToken, setTempToken] = useState<string | null>(null);

  const generateQRCode = async () => {
    const enable = await fetch("/api/enable-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await enable.json();
    setQrCode(data.qr);
    console.log(qrCode);
    setTempToken(data.tempToken);
  };

  const verifyCode = async () => {
    const res = await fetch("/api/verify-2fa", {
      method: "POST",
      body: JSON.stringify({
        token: code,
        tempToken: tempToken,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.success) {
      toast("✅ Two-factor authentication verified.");
      router.refresh();
      router.replace("/profile");
    } else {
      toast.error(data.error || "Verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 ">
      <h2 className="text-xl font-bold mb-4 ">Two-Factor Authentication</h2>

      {!qrCode && (
        <button
          onClick={generateQRCode}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          Enable 2FA
        </button>
      )}

      {qrCode && (
        <div className="mt-4">
          <div className="w-full flex flex-col items-center justify-center">
            <p>Scan this QR code with Google Authenticator:</p>

            <Image
              src={qrCode}
              alt="2FA QR Code"
              className="my-4 w-[150px] h-[150px] "
              width={150}
              height={150}
            />
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border p-2 rounded "
            />
            <button
              onClick={verifyCode}
              className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
