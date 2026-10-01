import { localizePost, validatePosts, type BlogPost } from "@/lib/blog";
import type { Locale } from "@/components/homepage/content";
import { markdownPost } from "@/lib/markdown-blog";
import causiloRelease from "./causilo-release.md";
import causiloReleaseKo from "./causilo-release.ko.md";
import firstFundingRound from "./first-funding-round.md";
import firstFundingRoundKo from "./first-funding-round.ko.md";
import post_ephris_a_new_graph_without_a_new_training_run from "./ephris-a-new-graph-without-a-new-training-run.md";
// BLOG_IMPORTS: new-post.mjs inserts imports above this line.

const posts: readonly BlogPost[] = [
  markdownPost(causiloRelease, causiloReleaseKo),
  markdownPost(firstFundingRound, firstFundingRoundKo),
  markdownPost(post_ephris_a_new_graph_without_a_new_training_run),
  // BLOG_POSTS: new-post.mjs inserts registrations above this line.
];

validatePosts(posts);

export function getPosts(locale: Locale = "en"): BlogPost[] {
  return posts
    .filter(post => post.status !== "draft" || process.env.NODE_ENV === "development")
    .map(post => localizePost(post, locale))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string, locale: Locale = "en"): BlogPost | undefined {
  return getPosts(locale).find(post => post.slug === slug);
}
