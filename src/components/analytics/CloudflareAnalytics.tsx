"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export default function CloudflareAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(
      process.env.NODE_ENV === "production" &&
        window.location.hostname === "nums.world",
    );
  }, []);

  if (!enabled) return null;

  return (
    <Script
      id="cloudflare-web-analytics"
      type="module"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon='{"token":"f45c9dc93e1d4ad6afd0eac5d6af791b"}'
    />
  );
}
