"use client";

import { useEffect } from "react";
import { initCareersOutline } from "./outline-controller";

export default function OutlineInteraction() {
  useEffect(() => initCareersOutline(document.querySelector("[data-careers]")), []);
  return null;
}
