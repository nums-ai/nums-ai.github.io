import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleLayout from "@/components/blog/ArticleLayout";
import { getPost, getPosts } from "@/content/blog";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getPosts().map(post => ({ slug: post.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getPost(slug);
  if (!article) notFound();
  return {
    metadataBase: new URL("https://nums.world"),
    title: `${article.title} — Nums AI`, description: article.summary,
    alternates: { canonical: `/blog/${article.slug}/` },
    ...(article.author ? { authors: [{ name: article.author }] } : {}),
    ...(article.status === "draft" ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: article.title, description: article.summary, url: `/blog/${article.slug}/`, type: "article", publishedTime: article.date.length === 10 ? article.date : undefined,
      ...(article.hero ? { images: [{ url: article.hero.src, width: article.hero.width, height: article.hero.height, alt: article.hero.alt }] } : {}),
    },
  };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return <ArticleLayout post={post} locale="en" />;
}
