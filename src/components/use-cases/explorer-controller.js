/** Shared by the Next page and the self-contained HTML preview. */
export function initUseCases(root, initialGroup = "", initialDataset = "") {
  if (!root) return () => {};
  const buttons = Array.from(root.querySelectorAll("[data-case-group]"));
  const selectors = Array.from(root.querySelectorAll("[data-case-picker]"));
  const panels = Array.from(root.querySelectorAll("[data-case-panel]"));
  const details = Array.from(root.querySelectorAll("[data-case-details]"));
  const live = root.querySelector("[data-case-live]");
  let group = buttons.find(button => button.dataset.caseGroup === initialGroup)?.dataset.caseGroup
    ?? buttons.find(button => button.getAttribute("aria-pressed") === "true")?.dataset.caseGroup;
  let openPicker = null;
  let search = "";
  let searchTimer;

  function wrapper(picker) {
    return picker.closest("[data-case-picker-wrap]");
  }

  function closeMenu(restoreFocus = false) {
    if (!openPicker) return;
    const wrap = wrapper(openPicker);
    wrap.querySelector("[data-case-menu]").hidden = true;
    const trigger = wrap.querySelector("[data-case-trigger]");
    trigger.setAttribute("aria-expanded", "false");
    for (const option of wrap.querySelectorAll("[data-case-option]")) option.tabIndex = -1;
    openPicker = null;
    search = "";
    clearTimeout(searchTimer);
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  function focusOption(option) {
    const menu = option.closest("[data-case-menu]");
    for (const item of menu.querySelectorAll("[data-case-option]")) item.tabIndex = item === option ? 0 : -1;
    option.focus({ preventScroll: true });
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight;
    }
  }

  function openMenu(picker, edge) {
    closeMenu();
    openPicker = picker;
    const wrap = wrapper(picker);
    const menu = wrap.querySelector("[data-case-menu]");
    const bounds = wrap.getBoundingClientRect();
    const below = window.innerHeight - bounds.bottom - 24;
    const above = bounds.top - 100;
    const placeAbove = below < 180 && above > below;
    menu.dataset.placement = placeAbove ? "above" : "below";
    menu.style.maxHeight = `${Math.max(120, Math.min(340, placeAbove ? above : below))}px`;
    menu.hidden = false;
    wrap.querySelector("[data-case-trigger]").setAttribute("aria-expanded", "true");
    const options = Array.from(menu.querySelectorAll("[data-case-option]"));
    const selected = options.find(option => option.dataset.caseOption === picker.value);
    focusOption(edge === "first" ? options[0] : edge === "last" ? options.at(-1) : selected || options[0]);
  }

  function update(announce = true) {
    const picker = selectors.find(select => select.dataset.casePicker === group);
    if (!picker) return;
    for (const button of buttons) button.setAttribute("aria-pressed", String(button.dataset.caseGroup === group));
    for (const select of selectors) {
      const wrap = wrapper(select);
      wrap.hidden = select !== picker;
      select.disabled = select !== picker;
      for (const option of wrap.querySelectorAll("[data-case-option]")) {
        option.setAttribute("aria-selected", String(option.dataset.caseOption === select.value));
      }
    }
    for (const panel of panels) {
      panel.hidden = panel.dataset.casePanel !== picker.value;
    }
    for (const detail of details) {
      detail.hidden = detail.dataset.caseDetails !== picker.value;
    }
    const title = picker.selectedOptions[0]?.textContent ?? "";
    wrapper(picker).querySelector("[data-case-title]").textContent = title;
    if (announce && live) {
      live.textContent = `${title}.`;
    }
  }

  function choose(option) {
    const picker = option.closest("[data-case-picker-wrap]").querySelector("[data-case-picker]");
    picker.value = option.dataset.caseOption;
    update();
    closeMenu(true);
  }

  function click(event) {
    const button = event.target.closest("[data-case-group]");
    if (button && root.contains(button)) {
      closeMenu();
      group = button.dataset.caseGroup;
      update();
      return;
    }
    const trigger = event.target.closest("[data-case-trigger]");
    if (trigger && root.contains(trigger)) {
      const picker = trigger.closest("[data-case-picker-wrap]").querySelector("[data-case-picker]");
      if (openPicker === picker) closeMenu(true);
      else openMenu(picker);
      return;
    }
    const option = event.target.closest("[data-case-option]");
    if (option && root.contains(option)) choose(option);
  }

  function keydown(event) {
    const trigger = event.target.closest("[data-case-trigger]");
    if (trigger && ["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const picker = trigger.closest("[data-case-picker-wrap]").querySelector("[data-case-picker]");
      openMenu(picker, event.key === "Home" ? "first" : event.key === "End" ? "last" : undefined);
      return;
    }
    if (!openPicker) return;
    if (event.key === "Escape" || event.key === "Tab") {
      if (event.key === "Escape") event.preventDefault();
      closeMenu(true);
      return;
    }
    const option = event.target.closest("[data-case-option]");
    if (!option) return;
    const options = Array.from(wrapper(openPicker).querySelectorAll("[data-case-option]"));
    const index = options.indexOf(option);
    let next;
    if (event.key === "ArrowDown") next = options[Math.min(index + 1, options.length - 1)];
    else if (event.key === "ArrowUp") next = options[Math.max(index - 1, 0)];
    else if (event.key === "Home") next = options[0];
    else if (event.key === "End") next = options.at(-1);
    else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(option);
      return;
    } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      search += event.key.toLocaleLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { search = ""; }, 600);
      const query = Array.from(search).every(letter => letter === search[0]) ? search[0] : search;
      const ordered = [...options.slice(index + 1), ...options.slice(0, index + 1)];
      next = ordered.find(item => item.textContent.trim().toLocaleLowerCase().startsWith(query));
      event.preventDefault();
    }
    if (next) {
      event.preventDefault();
      focusOption(next);
    }
  }

  function change(event) {
    if (event.target.matches("[data-case-picker]")) {
      closeMenu();
      update();
    }
  }
  function outside(event) {
    if (openPicker && !wrapper(openPicker).contains(event.target)) closeMenu();
  }
  function focusout(event) {
    if (openPicker && event.relatedTarget && !wrapper(openPicker).contains(event.relatedTarget)) closeMenu();
  }
  function resize() {
    closeMenu(true);
  }

  // The first option is the largest relative gain, selected in the server HTML.
  // Shuffle only the remainder once per page visit, keeping menus stable while
  // switching groups and reopening them. Mirror the order in the native state.
  for (const picker of selectors) {
    if (picker.dataset.caseShuffled) continue;
    const menu = wrapper(picker).querySelector("[data-case-menu]");
    const options = Array.from(menu.querySelectorAll("[data-case-option]"));
    for (let index = options.length - 1; index > 1; index--) {
      const swap = 1 + Math.floor(Math.random() * index);
      [options[index], options[swap]] = [options[swap], options[index]];
    }
    const value = picker.value;
    const nativeOptions = new Map(Array.from(picker.options, option => [option.value, option]));
    for (const option of options) {
      menu.append(option);
      picker.append(nativeOptions.get(option.dataset.caseOption));
    }
    picker.value = value;
    picker.dataset.caseShuffled = "true";
  }

  const initialPicker = selectors.find(picker => picker.dataset.casePicker === group);
  if (initialPicker && Array.from(initialPicker.options).some(option => option.value === initialDataset)) {
    initialPicker.value = initialDataset;
  }

  root.addEventListener("click", click);
  root.addEventListener("change", change);
  root.addEventListener("keydown", keydown);
  root.addEventListener("focusout", focusout);
  document.addEventListener("pointerdown", outside);
  window.addEventListener("resize", resize);
  update(false);
  return () => {
    closeMenu();
    clearTimeout(searchTimer);
    root.removeEventListener("click", click);
    root.removeEventListener("change", change);
    root.removeEventListener("keydown", keydown);
    root.removeEventListener("focusout", focusout);
    document.removeEventListener("pointerdown", outside);
    window.removeEventListener("resize", resize);
  };
}
