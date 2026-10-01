import matter from "gray-matter";
import Markdown from "react-markdown";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import { Figure, Table } from "@/components/blog/ArticleBlocks";
import styles from "@/components/blog/article.module.css";
import { validatePosts, type BlogPost, type PostImage } from "./blog";

type FigureOptions = Omit<PostImage, "src" | "alt"> & { maxWidth?: number };
type Metadata = Omit<BlogPost, "introduction" | "sections"> & {
  figures?: Record<string, FigureOptions>;
};
const parser = unified().use(remarkParse).use(remarkGfm).use(remarkDirective);

/** Only the shared presentation blocks extend ordinary Markdown. */
function articleDirectives() {
  return (tree: Root) => {
    visit(tree, node => {
      if (node.type !== "containerDirective" && node.type !== "leafDirective" && node.type !== "textDirective") return;
      const data = node.data ?? (node.data = {});
      if (node.type === "leafDirective" && node.name === "caption") {
        data.hName = "p";
        data.hProperties = { className: [styles.caption] };
      } else if (node.type === "leafDirective" && node.name === "links") {
        data.hName = "p";
        data.hProperties = { className: [styles.resourceLinks] };
        visit(node, "link", link => {
          if (!link.url.startsWith("https://")) return;
          link.data = { ...link.data, hProperties: { target: "_blank", rel: ["noopener", "noreferrer"] } };
        });
      } else if (node.type === "textDirective" && node.name === "small") {
        data.hName = "small";
      } else if (node.type === "containerDirective" && (node.name === "details" || node.name === "references")) {
        const label = node.children[0];
        if (label?.type !== "paragraph" || !label.data?.directiveLabel || !toString(label).trim()) {
          throw new Error(`Use :::${node.name}[Title] with a nonempty title.`);
        }
        const isDetails = node.name === "details";
        data.hName = isDetails ? "details" : "section";
        data.hProperties = { className: [isDetails ? styles.appendix : styles.references], id: node.attributes?.id ?? undefined };
        label.data.hName = isDetails ? "summary" : "h3";
        label.data.hProperties = isDetails ? { "aria-label": toString(label) } : undefined;
      } else {
        throw new Error(`Unknown blog block: ${node.name}. Use caption, links, details, references, or small.`);
      }
    });
  };
}

function MarkdownBody({ source, figures = {} }: { source: string; figures?: Metadata["figures"] }) {
  return <Markdown remarkPlugins={[remarkGfm, remarkDirective, articleDirectives]} components={{
    // A standalone Markdown image renders a figure, without an invalid wrapping <p>.
    p: ({ children, node, ...props }) => node?.children.length === 1 && node.children[0].type === "element" && node.children[0].tagName === "img"
      ? <>{children}</> : <p {...props}>{children}</p>,
    img: ({ src, alt }) => {
      const path = typeof src === "string" ? src : "";
      const options = figures[path.split("/").pop() ?? ""];
      if (!path.startsWith("/blog/") || path.includes("..") || !alt?.trim() || !options
        || !(options.width > 0) || !(options.height > 0)) {
        throw new Error(`Add local image dimensions under 'figures' for ${path}, and descriptive alt text.`);
      }
      return <Figure {...options} src={path} alt={alt} />;
    },
    table: ({ children }) => <Table>{children}</Table>,
  }}>{source}</Markdown>;
}

function readManuscript(source: string) {
  const { data, content } = matter(source);
  const metadata = data as Metadata;
  // YAML null explicitly clears an optional value inherited by a translation.
  if (data.titleKeepTogether === null) metadata.titleKeepTogether = undefined;
  const tree = parser.parse(content);
  const headings = tree.children.filter(node => node.type === "heading" && node.depth === 2);
  // Keep reference-style links working even when their definition is in another section.
  const references = tree.children.filter(node => node.type === "definition")
    .map(node => content.slice(node.position!.start.offset, node.position!.end.offset)).join("\n");
  const render = (text: string) => <MarkdownBody source={`${text}\n\n${references}`} figures={metadata.figures} />;
  const sections = headings.map((heading, index) => {
    const text = toString(heading);
    const explicitId = /\s+\{#([a-z0-9]+(?:-[a-z0-9]+)*)\}$/.exec(text);
    const title = explicitId ? text.slice(0, explicitId.index).trim() : text;
    const id = explicitId?.[1] ?? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const body = content.slice(heading.position!.end.offset, headings[index + 1]?.position!.start.offset);
    return { id, title, content: render(body) };
  });
  const introduction = content.slice(0, headings[0]?.position!.start.offset).trim();
  return { metadata, introduction: introduction ? render(introduction) : undefined, sections, hasBody: !!content.trim() };
}

/** Manuscripts are the only content source; the existing layout owns presentation. */
export function markdownPost(source: string, koreanSource?: string): BlogPost {
  const { metadata, introduction, sections } = readManuscript(source);
  for (const field of ["slug", "date", "title", "summary", "category"] as const) {
    if (typeof metadata[field] !== "string") {
      throw new Error(`Blog frontmatter needs a text '${field}' field. Put dates in quotes.`);
    }
  }
  if (!["draft", "published", "unlisted"].includes(metadata.status)) {
    throw new Error(`[blog: ${metadata.slug}] status must be draft, published, or unlisted.`);
  }
  const { figures: _figures, ...fields } = metadata;
  const post: BlogPost = { ...fields, introduction, sections };
  if (koreanSource) {
    const translation = readManuscript(koreanSource);
    const { figures: _translatedFigures, ...translatedFields } = translation.metadata;
    post.translations = { ...post.translations, ko: {
      ...translatedFields,
      ...(translation.hasBody ? { introduction: translation.introduction, sections: translation.sections } : {}),
    } };
  }
  validatePosts([post]);
  return post;
}
