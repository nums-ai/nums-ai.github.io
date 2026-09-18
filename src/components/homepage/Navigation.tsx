"use client";

import { useEffect, useRef } from "react";
import { content, type Locale } from "./content";
import styles from "./homepage.module.css";

export function Brand({ locale }: { locale: Locale }) {
  return <a href={locale === "ko" ? "/ko/" : "/"} className={styles.brand} aria-label="Nums AI"><img src="/logo-word.png" alt="" width="1248" height="216" /></a>;
}

export default function Navigation({ locale, page = "home" }: { locale: Locale; page?: "home" | "use-cases" | "blog" | "careers" }) {
  const copy = content[locale];
  const menu = useRef<HTMLDetailsElement>(null);
  const home = locale === "ko" ? "/ko/" : "/";
  const useCases = locale === "ko" ? "/ko/use-cases/" : "/use-cases/";
  const blog = locale === "ko" ? "/ko/blog/" : "/blog/";
  const destinations = [home, useCases, blog, `/careers/${locale}/`];
  const activeIndex = ["home", "use-cases", "blog", "careers"].indexOf(page);

  useEffect(() => {
    function close(event: KeyboardEvent | PointerEvent) {
      if (!menu.current?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        menu.current.open = false;
        menu.current.querySelector("summary")?.focus();
      } else if (!menu.current.contains(event.target as Node)) {
        menu.current.open = false;
      }
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", close);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", close);
    };
  }, []);

  return (
    <header className={`${styles.header}${page === "home" ? "" : ` ${styles.headerSeparated}`}`}>
      <a className={styles.skip} href="#main">{copy.skip}</a>
      <div className={styles.headerInner}>
        <Brand locale={locale} />
        <nav className={styles.navigation} aria-label={locale === "ko" ? "주 메뉴" : "Main navigation"}>
          {copy.navigation.map((label, index) => <a key={label} href={destinations[index]} aria-current={index === activeIndex ? "page" : undefined}>{label}</a>)}
        </nav>
        <div className={styles.headerActions}>
          <details ref={menu} className={styles.mobileMenu} data-preview-menu>
            <summary aria-label={copy.menu}><span /><span /></summary>
            <nav className={styles.mobileNavigation} aria-label={copy.menu}>
              {copy.navigation.map((label, index) => <a key={label} href={destinations[index]} aria-current={index === activeIndex ? "page" : undefined} onClick={() => { if (menu.current) menu.current.open = false; }}>{label}</a>)}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
