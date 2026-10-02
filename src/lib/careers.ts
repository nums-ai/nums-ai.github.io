import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type JobDescription = {
  id: string;
  title: string;
  order: number;
  body: string;
};

const contentDirectory = join(process.cwd(), "src/content/careers");
const reservedIds = new Set([
  "main", "about", "conditions", "application", "open-positions",
  "careers-outline-title", "careers-positions-label",
]);

/** Discover Markdown at build time; adding a JD never requires a code registration. */
export async function getJobDescriptions(directory = contentDirectory): Promise<JobDescription[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const filenames = entries
    .filter(entry => entry.isFile() && entry.name.endsWith(".md") && !entry.name.startsWith("_"))
    .map(entry => entry.name);

  const jobs = await Promise.all(filenames.map(async filename => {
    const fail = (message: string): never => { throw new Error(`[careers: ${filename}] ${message}`); };
    const id = filename.slice(0, -3);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || reservedIds.has(id)) {
      fail("Use a lowercase, hyphen-separated filename that does not match a shared page section.");
    }
    const source = await readFile(join(directory, filename), "utf8");
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(source);
    } catch {
      return fail("Invalid YAML frontmatter. Check the fields between the --- lines.");
    }
    const { data, content } = parsed;
    if (typeof data.title !== "string" || !data.title.trim()) fail("Add a nonempty title.");
    if (!Number.isSafeInteger(data.order) || data.order < 0) fail("order must be a nonnegative integer.");
    if (!["open", "draft", "closed"].includes(data.status)) fail("status must be open, draft, or closed.");
    if (!content.trim()) fail("Add the job description below the frontmatter.");
    if (data.status !== "open") return null;
    return { id, title: data.title.trim(), order: data.order, body: content.trim() } as JobDescription;
  }));

  return jobs.filter((job): job is JobDescription => job !== null)
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
