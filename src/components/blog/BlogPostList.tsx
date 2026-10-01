"use client";

import { useState, type ReactNode } from "react";
import styles from "./blog.module.css";

type Item = { slug: string; category: string; card: ReactNode };

export default function BlogPostList({ items, allLabel, filterLabel }: {
  items: Item[];
  allLabel: string;
  filterLabel: string;
}) {
  const [selected, setSelected] = useState("");
  const categories = [...new Set(items.map(item => item.category))].sort();
  const visible = selected ? items.filter(item => item.category === selected) : items;

  return <>
    {categories.length > 1 && <nav className={styles.categories} aria-label={filterLabel}>
      {["", ...categories].map(category => <button key={category} type="button"
        aria-pressed={selected === category} onClick={() => setSelected(category)}>
        {category || allLabel}
      </button>)}
    </nav>}
    <div className={styles.postGrid}>{visible.map(item => <div key={item.slug}>{item.card}</div>)}</div>
  </>;
}
