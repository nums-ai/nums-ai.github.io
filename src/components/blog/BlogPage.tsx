import Navigation from "../homepage/Navigation";
import Footer from "../homepage/Footer";
import { Arrow } from "../homepage/Icons";
import type { Locale } from "../homepage/content";
import type { BlogPost } from "@/lib/blog";
import { getPosts } from "@/content/blog";
import shared from "../homepage/homepage.module.css";
import styles from "./blog.module.css";
import PostTitle from "./PostTitle";
import BlogPostList from "./BlogPostList";

const copy = {
  en: { title: "Blog", introduction: "Research, experiments, model releases, and company news from Nums AI.", emptyTitle: "Coming soon", emptyDescription: "Our first posts are on the way. Check back soon for updates from Nums AI.", all: "All posts", filter: "Filter posts by category" },
  ko: { title: "블로그", introduction: "Nums AI의 연구, 실험, 모델 공개, 회사 소식을 전합니다.", emptyTitle: "곧 만나요", emptyDescription: "첫 게시글을 준비하고 있습니다. 곧 Nums AI의 새로운 소식을 전해 드리겠습니다.", all: "전체 글", filter: "분류별 글 보기" },
};

function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  return <article>
    <a className={styles.postCard} aria-labelledby={`card-${post.slug}`} href={`${locale === "ko" ? "/ko/blog/" : "/blog/"}${post.slug}/`}>
      {post.hero && <img src={post.hero.src} alt={post.hero.alt} width={post.hero.width} height={post.hero.height} loading="lazy" />}
      <p className={styles.cardCategory}>{post.category}</p>
      <h2 id={`card-${post.slug}`}><PostTitle post={post} /></h2>
      <p className={styles.cardSummary}>{post.cardSummary ?? post.summary}</p>
      <span className={styles.readArticle}>{locale === "ko" ? "전체 글 읽기" : "Read full article"}<Arrow /></span>
    </a>
  </article>;
}

export default function BlogPage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const posts = getPosts(locale);
  const listedPosts = posts.filter(post => post.status !== "unlisted");
  return <div className={`${shared.site} ${styles.blogSite}`} lang={locale}>
    <Navigation locale={locale} page="blog" />
    <main id="main" className={styles.listing}>
      <header className={`${shared.container} ${shared.pageIntro}`}><h1 className={shared.pageTitle}>{text.title}</h1><p className={shared.prose}>{text.introduction}</p></header>
      {listedPosts.length ? <section className={`${shared.container} ${styles.posts}`} aria-label={text.title}>
        <BlogPostList
          items={listedPosts.map(post => ({ slug: post.slug, category: post.category, card: <PostCard post={post} locale={locale} /> }))}
          allLabel={text.all} filterLabel={text.filter}
        />
      </section> : <section className={`${shared.container} ${styles.emptyState}`} aria-labelledby="blog-empty-title">
        <h2 id="blog-empty-title">{text.emptyTitle}</h2>
        <p>{text.emptyDescription}</p>
      </section>}
    </main>
    <Footer locale={locale} />
  </div>;
}
