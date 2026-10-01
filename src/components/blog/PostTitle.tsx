import type { BlogPost } from "@/lib/blog";
import styles from "./blog.module.css";

export default function PostTitle({ post }: { post: BlogPost }) {
  const ending = post.titleKeepTogether;
  if (!ending) return post.title;
  return <>{post.title.slice(0, -ending.length)}<span className={styles.titleEnding}>{ending}</span></>;
}
