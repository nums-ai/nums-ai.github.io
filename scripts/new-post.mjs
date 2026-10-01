import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const [slug, ...extra] = process.argv.slice(2);
if (!slug || extra.length || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run blog:new -- your-post-slug\nUse lowercase letters, numbers, and single hyphens.");
  process.exit(1);
}
if (slug === "index") {
  console.error("The slug 'index' is reserved for the blog registry. Choose another slug.");
  process.exit(1);
}

const contentDir = join(root, "src/content/blog");
const registryPath = join(contentDir, "index.ts");
const importMarker = "// BLOG_IMPORTS: new-post.mjs inserts imports above this line.";
const postMarker = "  // BLOG_POSTS: new-post.mjs inserts registrations above this line.";
const name = `post_${slug.replaceAll("-", "_")}`;

try {
  const [template, registry] = await Promise.all([
    readFile(join(contentDir, "_template.md"), "utf8"),
    readFile(registryPath, "utf8"),
  ]);
  if (registry.split(importMarker).length !== 2 || registry.split(postMarker).length !== 2) {
    throw new Error("The registry markers are missing or repeated. Restore them before generating a post.");
  }
  if (registry.includes(`from "./${slug}.md"`)) throw new Error(`The post '${slug}' is already registered.`);
  const title = slug.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
  const source = template.replaceAll("__SLUG__", slug).replaceAll("__TITLE__", title).replaceAll("__DATE__", new Date().toISOString().slice(0, 10));
  const postPath = join(contentDir, `${slug}.md`);
  // Never overwrite an author's existing file.
  await writeFile(postPath, source, { flag: "wx" });
  await mkdir(join(root, "public/blog", slug), { recursive: true });
  await writeFile(registryPath, registry
    .replace(importMarker, `import ${name} from "./${slug}.md";\n${importMarker}`)
    .replace(postMarker, `  markdownPost(${name}),\n${postMarker}`));
  console.log(`Created draft: ${postPath}\nRegistered automatically. Add images to public/blog/${slug}/.\nStart (or restart) npm run dev, then open /blog/${slug}/.\nEdit the post and follow docs/WRITING_A_BLOG_POST.md before publishing.`);
} catch (error) {
  console.error(error.code === "EEXIST" ? `A file for '${slug}' already exists; nothing was overwritten.` : error.message);
  process.exitCode = 1;
}
