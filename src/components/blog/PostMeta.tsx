import type { Locale } from "../homepage/content";
import { formatPostDate, type BlogPost } from "@/lib/blog";
import styles from "./blog.module.css";

export default function PostMeta({ post, locale, byline = false }: { post: BlogPost; locale: Locale; byline?: boolean }) {
  const date = formatPostDate(post.date, locale);
  return <div className={`${styles.meta}${byline ? ` ${styles.byline}` : ""}`}>
    {!byline && <span>{post.category}</span>}
    {post.author && <span className={styles.author}>{locale === "ko" ? "작성: " : "By "}{post.author}</span>}
    {post.date.length === 10 ? <time dateTime={post.date}>{date}</time> : <span>{date}</span>}
    {post.readingMinutes && <span>{post.readingMinutes} {locale === "ko" ? "분 읽기" : "min read"}</span>}
  </div>;
}
