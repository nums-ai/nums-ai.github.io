"use client";

import { useEffect } from "react";
import { initPythonQuickStart } from "./python-quick-start-controller";

export default function PythonQuickStartInteraction() {
  useEffect(() => initPythonQuickStart(document.querySelector("[data-python-quick-start]")), []);
  return null;
}
