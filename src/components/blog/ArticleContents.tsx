"use client";

import { useEffect, useRef, useState } from "react";
import type { ContentsItem } from "@/lib/blog";
import type { Locale } from "../homepage/content";
import styles from "./article.module.css";

function ContentsLinks({ sections, activeId, onNavigate }: { sections: readonly ContentsItem[]; activeId?: string; onNavigate?: () => void }) {
  return <ol className={styles.contentsLinks}>
    {sections.map(({ id, title }) => <li key={id}><a href={`#${id}`} aria-current={activeId === id ? "location" : undefined} onClick={onNavigate}>{title}</a></li>)}
  </ol>;
}

export default function ArticleContents({ sections, locale }: { sections: readonly ContentsItem[]; locale: Locale }) {
  const [activeId, setActiveId] = useState("article-top");
  const label = locale === "ko" ? "목차" : "On this page";

  useEffect(() => {
    const headings = sections.map(({ id }) => document.getElementById(id)).filter((heading): heading is HTMLElement => heading !== null);
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
      const current = atBottom ? headings.at(-1) : headings.filter(heading => heading.getBoundingClientRect().top <= 140).at(-1);
      setActiveId(current?.id ?? "article-top");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return <aside className={styles.contents}>
    <nav className={styles.desktopContents} aria-label={label}>
      <p className={styles.contentsTitle}>{label}</p>
      <ContentsLinks sections={sections} activeId={activeId} />
    </nav>
  </aside>;
}

export function MobileArticleContents({ sections, locale }: { sections: readonly ContentsItem[]; locale: Locale }) {
  const details = useRef<HTMLDetailsElement>(null);
  const label = locale === "ko" ? "목차" : "On this page";
  return <details className={styles.mobileContents} ref={details} data-preview-menu>
    <summary aria-label={label}>{label}</summary>
    <nav aria-label={label}><ContentsLinks sections={sections} onNavigate={() => { if (details.current) details.current.open = false; }} /></nav>
  </details>;
}
