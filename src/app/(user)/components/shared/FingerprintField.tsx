"use client";

import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function FingerprintField() {
  const [fp, setFp] = useState("");

  useEffect(() => {
    const loadFingerprint = async () => {
      const fpLip = await FingerprintJS.load();
      const result = await fpLip.get();
      setFp(result.visitorId);
    };
    loadFingerprint();
  }, []);

  return <input type="hidden" name="fingerprint" value={fp} />;
}
