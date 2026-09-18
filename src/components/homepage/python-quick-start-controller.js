/** Copy controls shared by the Next.js homepage and its standalone preview. */
export function initPythonQuickStart(root) {
  if (!root) return () => {};
  const status = root.querySelector("[data-copy-status]");
  const resets = new Map();
  let active = true;

  async function copy(event) {
    const button = event.target instanceof Element ? event.target.closest("button[data-copy-target]") : null;
    if (!button || !root.contains(button)) return;
    const source = root.querySelector(`[data-copy-source="${button.dataset.copyTarget}"]`);
    const label = button.querySelector("[data-copy-label]");
    if (!source || !label) return;

    clearTimeout(resets.get(button));
    button.disabled = true;
    status.textContent = "";
    try {
      await navigator.clipboard.writeText(source.textContent);
      if (!active) return;
      label.textContent = root.dataset.copiedLabel;
      button.dataset.copied = "true";
      status.textContent = button.dataset.copySuccess;
    } catch {
      if (!active) return;
      label.textContent = root.dataset.failedLabel;
      delete button.dataset.copied;
      status.textContent = root.dataset.copyError;
    } finally {
      if (active) {
        button.disabled = false;
        resets.set(button, setTimeout(() => {
          label.textContent = root.dataset.copyLabel;
          delete button.dataset.copied;
          resets.delete(button);
        }, 2500));
      }
    }
  }

  root.addEventListener("click", copy);
  return () => {
    active = false;
    root.removeEventListener("click", copy);
    for (const timer of resets.values()) clearTimeout(timer);
  };
}
