/** Shared interactions for the Next.js chart and the standalone HTML preview. */
export function initEloChart(root) {
  if (!root) return () => {};
  const buttons = Array.from(root.querySelectorAll("[data-elo-toggle]"));
  const bars = Array.from(root.querySelectorAll("[data-elo-bar]"));
  const families = Array.from(root.querySelectorAll("[data-elo-family]"));
  const format = value => Number(value).toLocaleString("en-US", { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function updateSeries() {
    const enabled = buttons.filter(button => button.getAttribute("aria-pressed") === "true").map(button => button.dataset.eloToggle);
    for (const button of buttons) {
      const last = enabled.length === 1 && enabled.includes(button.dataset.eloToggle);
      button.setAttribute("aria-disabled", String(last));
      if (last) button.setAttribute("aria-description", root.dataset.keepOne);
      else button.removeAttribute("aria-description");
    }
    for (const family of families) {
      const familyBars = Array.from(family.querySelectorAll("[data-elo-bar]"));
      const visible = familyBars.filter(bar => bar.dataset.reference === "true" || enabled.includes(bar.dataset.variant));
      for (const bar of familyBars) {
        const shown = visible.includes(bar);
        bar.style.display = shown ? "" : "none";
        bar.setAttribute("tabindex", shown ? "0" : "-1");
        if (!shown) bar.setAttribute("aria-hidden", "true");
        else bar.removeAttribute("aria-hidden");
        const offset = bar.dataset.reference === "true" ? 0 : (visible.indexOf(bar) - (visible.length - 1) / 2) * 27;
        bar.setAttribute("transform", `translate(${offset - Number(bar.dataset.originalOffset)} 0)`);
      }
      const label = family.querySelector("[data-elo-score]");
      label.textContent = format(Math.max(...visible.map(bar => Number(bar.dataset.elo))));
      label.setAttribute("y", String(Math.min(...visible.map(bar => Number(bar.dataset.labelY)))));
    }
  }

  function getBar(target) {
    return target instanceof Element ? target.closest("[data-elo-bar]") : null;
  }

  function click(event) {
    const button = event.target instanceof Element ? event.target.closest("[data-elo-toggle]") : null;
    if (button && root.contains(button)) {
      if (button.getAttribute("aria-disabled") === "true") return;
      button.setAttribute("aria-pressed", String(button.getAttribute("aria-pressed") !== "true"));
      updateSeries();
    }
  }

  function keydown(event) {
    const bar = getBar(event.target);
    if (!bar) return;
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const visible = bars.filter(item => item.style.display !== "none");
      const index = visible.indexOf(bar);
      const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1
        : (index + (["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 1) + visible.length) % visible.length;
      visible[next].scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
      visible[next].focus({ preventScroll: true });
    }
  }

  updateSeries();
  root.dataset.eloReady = "true";
  root.addEventListener("click", click);
  root.addEventListener("keydown", keydown);

  return () => {
    delete root.dataset.eloReady;
    root.removeEventListener("click", click);
    root.removeEventListener("keydown", keydown);
  };
}
