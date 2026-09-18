import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Navigation from "@/components/homepage/Navigation";
import Footer from "@/components/homepage/Footer";
import { Arrow } from "@/components/homepage/Icons";
import shared from "@/components/homepage/homepage.module.css";
import styles from "../careers.module.css";
import { careersContentEn } from "../content.en";
import OutlineInteraction from "../OutlineInteraction";

const contentByLocale = {
  en: careersContentEn,
} as const;

type Locale = keyof typeof contentByLocale;
type CareersPageProps = { params: Promise<{ locale: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }];
}

function getLocale(value?: string): Locale {
  if (!value) return "en";
  if (!(value in contentByLocale)) notFound();
  return value as Locale;
}

function getMetadata(locale: Locale): Metadata {
  const content = contentByLocale[locale];

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      type: "website",
      siteName: "Nums AI",
      locale: "en_US",
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

function Disclosure({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <details className={styles.disclosure} id={id} name="careers-positions">
      <summary className={styles.disclosureSummary}>
        <h2>Position: {title}</h2>
        <svg className={styles.disclosureIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 6v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </summary>
      <div className={styles.disclosureBody}>{children}</div>
    </details>
  );
}

export default async function CareersPage({
  params,
}: CareersPageProps) {
  const locale = getLocale((await params).locale);
  const content = contentByLocale[locale];

  return (
    <div className={shared.site} lang={locale}>
      <Navigation locale={locale} page="careers" />
      <main id="main">
        <header className={`${shared.container} ${shared.pageIntro}`}>
          <h1 className={shared.pageTitle}>{content.hero.title}</h1>
          <p className={shared.prose}>{content.hero.subtitle}</p>
        </header>

        <div className={styles.contentBand}>
          <div className={`${shared.container} ${styles.layout}`} data-careers>
            <aside className={styles.outline}>
              <p className={styles.outlineTitle} id="careers-outline-title">{content.outline.label}</p>
              <nav className={styles.outlineNav} aria-labelledby="careers-outline-title" data-careers-outline>
                <ul>
                  <li><a href="#about">{content.about.title}</a></li>
                  <li>
                    <a href={`#${content.roles[0].id}`} id="careers-positions-label" data-outline-group>{content.outline.positionsLabel}</a>
                    <ul className={styles.outlinePositions} aria-labelledby="careers-positions-label">
                      {[...content.roles, content.openApplication].map(({ title, id }) => (
                        <li key={id}><a href={`#${id}`}>{title}</a></li>
                      ))}
                    </ul>
                  </li>
                  <li><a href={`#${content.conditions.id}`}>{content.conditions.title}</a></li>
                  <li><a href={`#${content.application.id}`}>{content.application.title}</a></li>
                </ul>
              </nav>
            </aside>
            <div className={styles.content}>
              <section className={styles.section} id="about">
                <h2>{content.about.title}</h2>
                <div className={styles.prose}>
                  {content.about.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <div className={styles.disclosures}>
                {content.roles.map((role) => (
                  <Disclosure id={role.id} title={role.title} key={role.id}>
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
                  </Disclosure>
                ))}

                <Disclosure id={content.openApplication.id} title={content.openApplication.title}>
                  <div className={styles.prose}>
                    {content.openApplication.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <List>{content.openApplication.bullets}</List>
                </Disclosure>
              </div>

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
                  {content.application.email}<Arrow diagonal />
                </a>
              </section>
            </div>
          </div>
        </div>
        <OutlineInteraction />
      </main>

      <Footer locale={locale} />
    </div>
  );
}
