import { content, links, type Locale } from "./content";
import Navigation from "./Navigation";
import Footer from "./Footer";
import TabularExplainer from "./TabularExplainer";
import EloChart from "./EloChart";
import PythonQuickStart from "./PythonQuickStart";
import DataPattern from "./DataPattern";
import { Arrow, DomainIcon } from "./Icons";
import { groups } from "../use-cases/content";
import styles from "./homepage.module.css";

const investors = [
  { name: "Stonebridge Ventures", image: "stonebridge.svg", width: 154, height: 31 },
  { name: "SBVA", image: "sbva.png", width: 114, height: 21 },
  { name: "KT Investment", image: "kt-investment.png", width: 153, height: 23 },
  { name: "BASS Ventures", image: "bass.svg", width: 89, height: 38 },
];

export default function Homepage({ locale }: { locale: Locale }) {
  const copy = content[locale];

  return (
    <div className={`${styles.site} ${styles.homepageRoot}`} lang={locale}>
      <Navigation locale={locale} />
      <main id="main">
        <section className={styles.hero} aria-labelledby="hero-title">
          <img
            className={styles.heroImage}
            src="/homepage/structure.webp"
            alt=""
            width="1536"
            height="1024"
            fetchPriority="high"
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroCopy}>
            <h1 id="hero-title" className={styles.heroTitle}>
              {copy.headline.map((line, index) => <span key={line}>{index > 0 ? " " : ""}{line}</span>)}
            </h1>
            <p className={styles.heroDescription}>
              {copy.heroDescription}{" "}{copy.heroDescriptionSecond}
            </p>
            <div className={styles.heroActions}>
              <a href={links.github} className={`${styles.primaryLink} ${styles.secondaryLink}`} target="_blank" rel="noopener noreferrer">
                GitHub<Arrow diagonal />
              </a>
              <a href={links.model} className={`${styles.primaryLink} ${styles.secondaryLink}`} target="_blank" rel="noopener noreferrer">
                Hugging Face<Arrow diagonal />
              </a>
            </div>
          </div>
        </section>

        <section
          id="backers"
          className={`${styles.container} ${styles.backers}`}
          aria-label={copy.backed}
        >
          <span>{copy.backed}</span>
          <ul>
            {investors.map((investor) => (
              <li key={investor.name}>
                <img
                  src={`/homepage/${investor.image}`}
                  alt={investor.name}
                  width={investor.width}
                  height={investor.height}
                />
              </li>
            ))}
          </ul>
        </section>

        <section
          id="model"
          className={`${styles.container} ${styles.editorialSection} ${styles.foundationSection}`}
          aria-labelledby="model-title"
        >
          <div className={styles.sectionBody}>
            <h2 id="model-title" className={styles.sectionTitle}>
              {copy.modelTitle}
            </h2>
            <div className={styles.modelCopy}>
              <p>{copy.modelDescription}</p>
            </div>
            <TabularExplainer locale={locale} />
          </div>
        </section>

        <section id="performance" className={styles.performanceSection} aria-labelledby="performance-title">
          <div className={styles.performanceTexture} aria-hidden="true"><DataPattern variant="science" /></div>
          <div className={`${styles.container} ${styles.editorialSection} ${styles.performanceGrid}`}>
            <div className={styles.performanceCopy}>
              <h2 id="performance-title" className={styles.sectionTitle}>
                {copy.causiloTitle}
              </h2>
              <p className={styles.prose}>{copy.causiloDescription}</p>
            </div>
            <div className={styles.performanceChart}>
              <EloChart locale={locale} />
            </div>
          </div>
        </section>

        <PythonQuickStart locale={locale} />

        <section
          id="applications"
          className={`${styles.container} ${styles.editorialSection} ${styles.applicationsSection}`}
          aria-labelledby="applications-title"
        >
          <div className={styles.sectionBody}>
            <h2 id="applications-title" className={styles.sectionTitle}>
              {copy.applicationsTitle[0]}{" "}<span>{copy.applicationsTitle[1]}</span>
            </h2>
            <p className={styles.prose}>{copy.applicationsDescription}</p>
            <ul className={styles.applications}>
              {groups.map(group => (
                <li key={group.id}>
                  <a
                    className={styles.application}
                    href={`${locale === "ko" ? "/ko/use-cases/" : "/use-cases/"}?domain=${group.id}#use-case-explorer`}
                    aria-labelledby={`application-${group.id}`}
                  >
                    <div className={styles.applicationVisual} aria-hidden="true">
                      <DataPattern variant={group.id} className={styles.applicationPattern} />
                      <span className={styles.applicationIcon}><DomainIcon domain={group.id} /></span>
                      <span className={styles.applicationArrow}><Arrow diagonal /></span>
                    </div>
                    <h3 id={`application-${group.id}`}>{group.name[locale]}</h3>
                    <p>{group.description[locale]}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="updates" className={styles.updatesSection} aria-labelledby="updates-title">
          <div className={styles.container}>
            <h2 id="updates-title" className={styles.sectionTitle}>{copy.updatesTitle}</h2>
            <div className={styles.companyGrid}>
              <a className={styles.companyItem} href={locale === "ko" ? "/ko/blog/" : "/blog/"} aria-labelledby="blog-title">
                <h3 id="blog-title">{copy.blogTitle}</h3>
                <p>{copy.blogDescription}</p>
                <span className={styles.companyLink}>{copy.blogLink}<Arrow /></span>
              </a>
              <a id="careers" className={styles.companyItem} href={`/careers/${locale}/`} aria-labelledby="careers-title">
                <h3 id="careers-title">{copy.careersTitle}</h3>
                <p>{copy.careersDescription}</p>
                <span className={styles.companyLink}>{copy.careersLink}<Arrow /></span>
              </a>
              <a id="contact" className={styles.companyItem} href={links.contact} aria-labelledby="contact-title">
                <h3 id="contact-title">{copy.contact}</h3>
                <p>{copy.contactDescription}</p>
                <span className={styles.companyLink}>contact@nums.world<Arrow diagonal /></span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
