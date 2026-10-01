import type { ReactNode } from "react";
import styles from "./article.module.css";

export { default as Figure } from "./ArticleFigure";

export function Table({ children }: { children: ReactNode }) {
  return <div className={styles.tableWrap}><table>{children}</table></div>;
}
