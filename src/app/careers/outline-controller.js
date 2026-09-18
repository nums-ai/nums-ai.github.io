/** Keep the Careers outline in sync in both Next.js and the standalone preview. */
export function initCareersOutline(root) {
  if (!root) return () => {};
  const outline = root.querySelector("[data-careers-outline]");
  if (!outline) return () => {};
  const links = [...outline.querySelectorAll('a[href^="#"]')];
  const positionsLink = outline.querySelector("[data-outline-group]");
  const entries = [...outline.querySelectorAll('a[href^="#"]:not([data-outline-group])')].map(link => ({
    link,
    section: document.getElementById(link.getAttribute("href").slice(1)),
  })).filter(entry => entry.section && root.contains(entry.section));
  if (!entries.length) return () => {};
  const positions = entries.filter(entry => entry.section.matches('details[name="careers-positions"]'));

  const header = root.closest("main")?.previousElementSibling;
  let current = null;
  let frame = 0;

  function update() {
    frame = 0;
    const viewportTop = Math.max(0, header?.getBoundingClientRect().bottom ?? 0);
    const readingEdge = viewportTop + 24;
    const visibleHeight = (top, bottom) => Math.max(0, Math.min(bottom, window.innerHeight) - Math.max(top, viewportTop));
    let active = entries[0];
    for (const entry of entries) {
      if (entry.section.getBoundingClientRect().top > readingEdge) break;
      active = entry;
    }
    // The last section may never reach the header when the page runs out of scroll.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      active = entries[entries.length - 1];
    }
    let activeLink = active.link;
    const activeBounds = active.section.getBoundingClientRect();
    const activeHeight = visibleHeight(activeBounds.top, activeBounds.bottom);
    const visiblePosition = positions.find(({ section }) => {
      if (!section.open) return false;
      const bodyTop = section.querySelector("summary").getBoundingClientRect().bottom;
      const height = visibleHeight(bodyTop, section.getBoundingClientRect().bottom);
      return height > 0 && (positions.includes(active) || height > activeHeight);
    });
    if (visiblePosition) {
      activeLink = visiblePosition.link;
    } else if (positions.length) {
      const positionsHeight = visibleHeight(
        positions[0].section.getBoundingClientRect().top,
        positions[positions.length - 1].section.getBoundingClientRect().bottom,
      );
      if (positions.includes(active) || positionsHeight > activeHeight) {
        activeLink = positionsLink ?? activeLink;
      }
    }
    if (activeLink === current) return;
    current = activeLink;
    for (const link of links) {
      if (link === activeLink) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function togglePosition(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    const position = positions.find(entry => entry.link === link);
    if (!position) return;
    // Toggle before the native anchor or preview router scrolls to the target.
    position.section.open = !position.section.open;
    schedule();
  }

  const observer = new ResizeObserver(schedule);
  entries.forEach(entry => observer.observe(entry.section));
  outline.addEventListener("click", togglePosition);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  root.addEventListener("toggle", schedule, true);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    outline.removeEventListener("click", togglePosition);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    root.removeEventListener("toggle", schedule, true);
  };
}
