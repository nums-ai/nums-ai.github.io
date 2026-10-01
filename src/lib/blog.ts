import type { ReactNode } from "react";
import type { Locale } from "@/components/homepage/content";

export type PostImage = { src: string; alt: string; width: number; height: number; caption?: ReactNode; minWidth?: number };
export type PostSection = { id: string; title: string; content: ReactNode };
export type PostLink = { label: string; href: string; external?: boolean };
type PostContent = {
  title: string;
  summary: string;
  /** Optional short introduction for the listing; otherwise uses summary. */
  cardSummary?: string;
  category: string;
  /** Optional ending to keep together when it fits; never forces a line break. */
  titleKeepTogether?: string;
  introduction?: ReactNode;
  sections: readonly PostSection[];
  resources?: readonly PostLink[];
};

export type BlogPost = PostContent & {
  slug: string;
  status: "draft" | "published" | "unlisted";
  /** YYYY-MM-DD. A year alone is supported for older announcements. */
  date: string;
  author?: string;
  readingMinutes?: number;
  hero?: PostImage;
  /** Existing translations are retained; new English posts need no translations. */
  translations?: Partial<Record<Locale, Partial<PostContent>>>;
};

export type ContentsItem = Pick<PostSection, "id" | "title">;

export function localizePost(post: BlogPost, locale: Locale): BlogPost {
  return { ...post, ...post.translations?.[locale] };
}

export function formatPostDate(date: string, locale: Locale): string {
  if (/^\d{4}$/.test(date)) return locale === "ko" ? `${date}년` : date;
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

/** Fail with the post's name instead of silently generating broken URLs or anchors. */
export function validatePosts(posts: readonly BlogPost[]): void {
  const slugs = new Set<string>();
  const identifier = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const post of posts) {
    const fail = (message: string): never => { throw new Error(`[blog: ${post.slug}] ${message}`); };
    if (!identifier.test(post.slug) || slugs.has(post.slug)) fail("Use a unique lowercase, hyphen-separated slug.");
    slugs.add(post.slug);
    if (!/^\d{4}(?:-\d{2}-\d{2})?$/.test(post.date)) fail("Date must be YYYY-MM-DD (or YYYY for older posts).");
    const date = new Date(`${post.date.length === 4 ? `${post.date}-01-01` : post.date}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || !date.toISOString().startsWith(post.date)) fail("Date is not a valid calendar date.");
    if (post.readingMinutes !== undefined && (!Number.isInteger(post.readingMinutes) || post.readingMinutes < 1)) fail("readingMinutes must be a positive integer.");
    if (post.status === "published" && !post.author?.trim()) fail("Add an author before publishing.");
    if (post.hero && (!post.hero.src.startsWith("/blog/") || post.hero.src.includes("..") || !post.hero.alt.trim()
      || !Number.isFinite(post.hero.width) || !Number.isFinite(post.hero.height) || post.hero.width <= 0 || post.hero.height <= 0)) {
      fail("The hero needs a local /blog/ image, descriptive alt text, and positive dimensions.");
    }
    for (const content of [post, ...Object.values(post.translations ?? {}).map(translation => ({ ...post, ...translation }))]) {
      if (![content.title, content.summary, content.category].every(value => value.trim())) fail("Title, summary, and category cannot be empty.");
      if (content.titleKeepTogether && !content.title.endsWith(content.titleKeepTogether)) fail("titleKeepTogether must match the title's ending.");
      const ids = new Set(["main", "article-top"]);
      for (const section of content.sections) {
        if (!identifier.test(section.id) || ids.has(section.id) || !section.title.trim()) fail(`Invalid or duplicate section: ${section.id}.`);
        ids.add(section.id);
      }
    }
  }
}
