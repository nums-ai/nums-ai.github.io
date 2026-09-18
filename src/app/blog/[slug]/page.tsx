import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPost } from "@/components/blog/BlogPage";
import posts from "@/components/blog/posts.json";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return posts.map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = posts.find(post => post.slug === slug);
  if (!article) notFound();
  return {
    title: `${article.title.en} — Nums AI`, description: article.summary.en,
    openGraph: { title: article.title.en, description: article.summary.en, type: "article", publishedTime: article.dateTime ?? undefined },
  };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = posts.find(post => post.slug === slug);
  if (!post) notFound();
  return <BlogPost post={post} locale="en" />;
}
