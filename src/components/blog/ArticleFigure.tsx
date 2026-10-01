"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./article.module.css";
import type { PostImage } from "@/lib/blog";

type Props = PostImage & { priority?: boolean; maxWidth?: number };

export default function ArticleFigure({ src, alt, width, height, caption, priority = false, maxWidth, minWidth }: Props) {
  const viewport = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const element = viewport.current;
    if (!element || !minWidth) return;
    const update = () => setOverflows(element.scrollWidth > element.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [minWidth]);
  const scrollable = !!minWidth && overflows;

  return <figure className={styles.figure} style={{ "--figure-ratio": width / height, maxWidth } as CSSProperties}>
    <div className={styles.figureViewport} ref={viewport} tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? "region" : undefined} aria-label={scrollable ? "Scrollable figure" : undefined}>
      <img src={src} alt={alt} width={width} height={height} style={minWidth ? { minWidth } : undefined}
        loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
    </div>
    {scrollable && <div className={styles.figureScrollHint}>Scroll the figure sideways to see the full view.</div>}
    {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
  </figure>;
}
