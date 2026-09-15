import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../signup.module.css";
import SignupForm from "../SignupForm";
import { signupContentEn } from "../content.en";
import { signupContentKo } from "../content.ko";

// Intake service from the causilo-serve repository, `signup/`.
// It validates the request, stores it, and emails a one-time link to the key.
const SIGNUP_ENDPOINT =
  "https://causilo-signup-43947296796.asia-southeast1.run.app/signup";

const contentByLocale = {
  en: signupContentEn,
  ko: signupContentKo,
} as const;

type Locale = keyof typeof contentByLocale;
type SignupPageProps = { params: Promise<{ locale: string }> };

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
        en: "/signup/en/",
        ko: "/signup/ko/",
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
}: SignupPageProps): Promise<Metadata> {
  return getMetadata(getLocale((await params).locale));
}

export default async function SignupPage({ params }: SignupPageProps) {
  const locale = getLocale((await params).locale);
  const content = contentByLocale[locale];
  const isKorean = locale === "ko";

  return (
    <>
      <nav
        className={styles.nav}
        aria-label={isKorean ? "가입 페이지 내비게이션" : "Sign-up navigation"}
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
              href="/signup/en/"
              hrefLang="en"
              aria-current={!isKorean ? "page" : undefined}
            >
              EN
            </Link>
            <Link
              className={isKorean ? styles.languageActive : undefined}
              href="/signup/ko/"
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
          <p className={styles.heroLead}>{content.hero.lead}</p>
        </header>

        <div className={styles.contentGrid}>
          <section
            className={styles.formSection}
            aria-label={isKorean ? "가입 양식" : "Sign-up form"}
          >
            <SignupForm endpoint={SIGNUP_ENDPOINT} content={content.form} />
          </section>

          <aside className={styles.tier}>
            <h2>{content.tier.title}</h2>
            <table className={styles.tierTable}>
              <tbody>
                {content.tier.rows.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>{content.tier.cellNote}</p>
            <p>
              {content.tier.commercialBefore}
              <a href={`mailto:${content.tier.commercialEmail}`}>
                {content.tier.commercialEmail}
              </a>
              {content.tier.commercialAfter}
            </p>
          </aside>
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
