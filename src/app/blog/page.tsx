import type { Metadata } from "next";
import BlogPage from "@/components/blog/BlogPage";

export const metadata: Metadata = {
  title: "Blog — Nums AI",
  description: "Research, model releases, and company news from Nums AI.",
};

export default function Blog() {
  return <BlogPage locale="en" />;
}
