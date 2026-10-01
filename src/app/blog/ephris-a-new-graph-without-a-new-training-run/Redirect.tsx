"use client";

import { useEffect } from "react";

export default function Redirect({ destination }: { destination: string }) {
  useEffect(() => {
    window.location.replace(`${destination}${window.location.search}${window.location.hash}`);
  }, [destination]);

  return null;
}
