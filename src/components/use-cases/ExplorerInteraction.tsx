"use client";

import { useEffect } from "react";
import { initUseCases } from "./explorer-controller";

export default function ExplorerInteraction() {
  useEffect(() => initUseCases(
    document.querySelector("[data-use-cases]"),
    new URLSearchParams(window.location.search).get("domain") ?? "",
    new URLSearchParams(window.location.search).get("dataset") ?? "",
  ), []);
  return null;
}
