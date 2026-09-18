"use client";

import { useEffect } from "react";
import { initEloChart } from "./elo-chart-controller";

export default function EloChartInteraction() {
  useEffect(() => initEloChart(document.querySelector("[data-elo-chart]")), []);
  return null;
}
