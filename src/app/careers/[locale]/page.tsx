import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../careers.module.css";
import { careersContentEn } from "../content.en";
import { careersContentKo } from "../content.ko";

const contentByLocale = {
  en: careersContentEn,
  ko: careersContentKo,
} as const;

type Locale = keyof typeof contentByLocale;
type CareersPageProps = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ko" }];
}

function getLocale(value?: string): Locale {
  if (!value) return "en";
  if (!(value in contentByLocale)) notFound();
  return value as Locale;
}

function getMetadata(locale: Locale): Metadata {
  const content = contentByLocale[locale];
  const isKorean = locale === "ko";

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      languages: {
        en: "/careers/en/",
        ko: "/careers/ko/",
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      type: "website",
      siteName: "Nums AI",
      locale: isKorean ? "ko_KR" : "en_US",
      alternateLocale: [isKorean ? "en_US" : "ko_KR"],
    },
  };
}

export async function generateMetadata({
  params,
}: CareersPageProps): Promise<Metadata> {
  return getMetadata(getLocale((await params).locale));
}

function List({ children }: { children: readonly string[] }) {
  return (
    <ul className={styles.list}>
      {children.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function CareersPage({
  params,
}: CareersPageProps) {
  const locale = getLocale((await params).locale);
  const content = contentByLocale[locale];
  const isKorean = locale === "ko";

  return (
    <>
      <nav
        className={styles.nav}
        aria-label={isKorean ? "채용 페이지 내비게이션" : "Careers navigation"}
      >
        <Link className="brand" href="/" aria-label="Nums AI — home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-word" role="img" aria-label="nums ai"></span>
        </Link>

        <div className={styles.navActions}>
          <div
            className={styles.languageToggle}
            aria-label={isKorean ? "언어 선택" : "Language selection"}
          >
            <Link
              className={!isKorean ? styles.languageActive : undefined}
              href="/careers/en/"
              hrefLang="en"
              aria-current={!isKorean ? "page" : undefined}
            >
              EN
            </Link>
            <Link
              className={isKorean ? styles.languageActive : undefined}
              href="/careers/ko/"
              hrefLang="ko"
              aria-current={isKorean ? "page" : undefined}
            >
              한국어
            </Link>
          </div>

          <Link className={styles.homeLink} href="/">
            {content.navigation.home}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </nav>

      <main className={styles.page} lang={locale}>
        <header className={styles.hero}>
          <span className={styles.kicker}>{content.hero.kicker}</span>
          <h1>{content.hero.title}</h1>
          <p className={styles.heroLead}>{content.hero.subtitle}</p>
          <a
            className={styles.primaryCta}
            href={`mailto:${content.application.email}`}
          >
            {content.hero.cta} <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className={styles.contentGrid}>
          <aside
            className={styles.index}
            aria-label={isKorean ? "페이지 목차" : "Page contents"}
          >
            <span className={styles.indexLabel}>{content.outline.label}</span>
            <ol>
              {content.outline.items.map(([number, label, id], index) => (
                <li
                  className={
                    index >= 1 && index <= 3
                      ? styles.roleOutlineItem
                      : undefined
                  }
                  key={id}
                >
                  <a href={`#${id}`}>
                    <span>{number}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={styles.article}>
            <section className={styles.section} id="about">
              <h2>{content.about.title}</h2>
              <div className={styles.prose}>
                {content.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            {content.roles.map((role) => (
              <section className={styles.section} id={role.id} key={role.id}>
                <h2>{role.title}</h2>
                <p className={styles.roleIntroduction}>{role.introduction}</p>

                <div className={styles.requirementBlock}>
                  <h3>{content.roleLabels.responsibilities}</h3>
                  <List>{role.responsibilities}</List>
                </div>
                <div className={styles.requirementBlock}>
                  <h3>{content.roleLabels.qualifications}</h3>
                  <List>{role.qualifications}</List>
                </div>
                <div className={styles.requirementBlock}>
                  <h3>{content.roleLabels.preferred}</h3>
                  <List>{role.preferred}</List>
                </div>
              </section>
            ))}

            <section
              className={styles.section}
              id={content.openApplication.id}
            >
              <h2>{content.openApplication.title}</h2>
              <div className={styles.prose}>
                {content.openApplication.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <List>{content.openApplication.bullets}</List>
            </section>

            <section className={styles.section} id={content.conditions.id}>
              <h2>{content.conditions.title}</h2>
              <div className={styles.prose}>
                {content.conditions.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <List>{content.conditions.bullets}</List>
            </section>

            <section className={styles.section} id={content.application.id}>
              <h2>{content.application.title}</h2>
              <List>{content.application.bullets}</List>
              <a
                className={styles.applicationCta}
                href={`mailto:${content.application.email}`}
              >
                {content.application.email} <span aria-hidden="true">↗</span>
              </a>
            </section>
          </article>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="wrap foot">
          <Link className="brand" href="/" aria-label="Nums AI — home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-word" role="img" aria-label="nums ai"></span>
          </Link>
          <span className="copy">{content.footer}</span>
        </div>
      </footer>
    </>
  );
}
