import type { Locale } from "./content";
import styles from "./homepage.module.css";

export default function Footer({ locale }: { locale: Locale }) {
  return <footer className={styles.footer}>
    <div className={`${styles.container} ${styles.footerRow}`}>
      <a href={locale === "ko" ? "/ko/" : "/"} className={styles.footerBrand} aria-label="Nums AI">
        <img src="/logo-word.png" alt="" width="1248" height="216" />
      </a>
      <span className={styles.copyright}>© 2026 Nums AI Inc.</span>
    </div>
  </footer>;
}
