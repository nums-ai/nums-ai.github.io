import { Fragment } from "react";
import Navigation from "../homepage/Navigation";
import Footer from "../homepage/Footer";
import { Arrow } from "../homepage/Icons";
import type { Locale } from "../homepage/content";
import type { BlogPost } from "@/lib/blog";
import shared from "../homepage/homepage.module.css";
import blog from "./blog.module.css";
import styles from "./article.module.css";
import ArticleContents, { MobileArticleContents } from "./ArticleContents";
import ArticleFigure from "./ArticleFigure";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
import { getPosts } from "@/content/blog";

export default function ArticleLayout({ post, locale }: { post: BlogPost; locale: Locale }) {
  const hasContents = post.sections.length > 0;
  const morePosts = getPosts(locale).filter(candidate => candidate.status !== "unlisted" && candidate.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category)).slice(0, 2);
  const listingUrl = locale === "ko" ? "/ko/blog/" : "/blog/";
  const contents = [{ id: "article-top", title: locale === "ko" ? "개요" : "Overview" }, ...post.sections.map(({ id, title }) => ({ id, title }))];
  return <div className={`${shared.site} ${blog.blogSite}`} lang={locale}>
    <Navigation locale={locale} page="blog" />
    <main id="main" className={`${shared.container} ${shared.pageMain} ${styles.article}${hasContents ? "" : ` ${styles.withoutContents}`}`}>
      <a className={blog.back} href={listingUrl}><Arrow />{locale === "ko" ? "전체 글" : "All posts"}</a>
      <div className={styles.articleLayout}>
        {hasContents && <ArticleContents sections={contents} locale={locale} />}
        <article className={styles.articleContent}>
          <header id="article-top" className={styles.header}>
            <p className={styles.category}>{post.category}</p>
            <h1 className={shared.pageTitle}><PostTitle post={post} /></h1>
            <PostMeta post={post} locale={locale} byline />
          </header>
          {hasContents && <MobileArticleContents sections={contents} locale={locale} />}
          <div className={styles.body}>
            {post.hero && <ArticleFigure {...post.hero} priority />}
            {post.introduction}
            {post.sections.map(section => <Fragment key={section.id}>
              <h2 id={section.id}>{section.title}</h2>
              {section.content}
            </Fragment>)}
          </div>
          {!!post.resources?.length && <div className={blog.resources}>
            {post.resources.map(link => <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined}>{link.label}<Arrow diagonal={link.external} /></a>)}
          </div>}
          <nav className={styles.articleEnd} aria-label={locale === "ko" ? "다른 글 탐색" : "Explore more posts"}>
            {!!morePosts.length && <>
              <h2>{locale === "ko" ? "다른 글도 읽어보세요" : "More from Nums AI"}</h2>
              {morePosts.map(candidate => <a key={candidate.slug} className={styles.morePost} href={`${listingUrl}${candidate.slug}/`}>
                <span><span className={styles.moreCategory}>{candidate.category}</span><span className={styles.moreTitle}>{candidate.title}</span></span>
                <Arrow />
              </a>)}
            </>}
            <a className={styles.allPosts} href={listingUrl}>{locale === "ko" ? "전체 글 보기" : "Browse all posts"}<Arrow /></a>
          </nav>
        </article>
      </div>
    </main>
    <Footer locale={locale} />
  </div>;
}
