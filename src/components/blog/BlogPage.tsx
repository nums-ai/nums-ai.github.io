import Navigation from "../homepage/Navigation";
import Footer from "../homepage/Footer";
import { Arrow } from "../homepage/Icons";
import type { Locale } from "../homepage/content";
import shared from "../homepage/homepage.module.css";
import styles from "./blog.module.css";
import posts from "./posts.json";

type Post = (typeof posts)[number];
const copy = {
  en: { title: "Blog", introduction: "Research, model releases, and company news from Nums AI.", emptyTitle: "Coming soon", emptyDescription: "Our first posts are on the way. Check back soon for updates from Nums AI.", back: "All posts", read: "Read article", footer: "Tabular foundation models. Built in Seoul." },
  ko: { title: "블로그", introduction: "Nums AI의 연구, 모델 공개, 회사 소식을 전합니다.", emptyTitle: "곧 만나요", emptyDescription: "첫 게시글을 준비하고 있습니다. 곧 Nums AI의 새로운 소식을 전해 드리겠습니다.", back: "전체 글", read: "글 읽기", footer: "서울에서 만드는 테이블 파운데이션 모델." },
};
const blogPath = (locale: Locale) => locale === "ko" ? "/ko/blog/" : "/blog/";

function PostMeta({ post, locale }: { post: Post; locale: Locale }) {
  return <div className={styles.meta}>
    <span>{post.category[locale]}</span>
    {post.dateTime ? <time dateTime={post.dateTime}>{post.date[locale]}</time> : <span>{post.date[locale]}</span>}
  </div>;
}

export default function BlogPage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  return <div className={shared.site} lang={locale}>
    <Navigation locale={locale} page="blog" />
    <main id="main" className={styles.listing}>
      <header className={`${shared.container} ${shared.pageIntro}`}><h1 className={shared.pageTitle}>{text.title}</h1><p className={shared.prose}>{text.introduction}</p></header>
      <section className={`${shared.container} ${styles.emptyState}`} aria-labelledby="blog-empty-title">
        <h2 id="blog-empty-title">{text.emptyTitle}</h2>
        <p>{text.emptyDescription}</p>
      </section>
    </main>
    <Footer locale={locale} />
  </div>;
}

export function BlogPost({ post, locale }: { post: Post; locale: Locale }) {
  return <div className={shared.site} lang={locale}>
    <Navigation locale={locale} page="blog" />
    <main id="main" className={`${shared.container} ${shared.pageMain}`}>
      <a className={styles.back} href={blogPath(locale)}><Arrow />{copy[locale].back}</a>
      <article>
        <header className={styles.articleHeader}>
          <PostMeta post={post} locale={locale} />
          <h1 className={shared.pageTitle}>{post.title[locale]}</h1>
          <p>{post.summary[locale]}</p>
        </header>
        <div className={styles.articleBody}>
          {post.sections.map(section => <section key={section.heading.en}>
            <h2>{section.heading[locale]}</h2>
            {section.paragraphs[locale].map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>)}
        </div>
        <div className={styles.resources}>
          {post.links.map(link => <a key={link.href.en} href={link.href[locale]} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>{link.label[locale]}<Arrow diagonal={link.external} /></a>)}
        </div>
      </article>
    </main>
    <Footer locale={locale} />
  </div>;
}
