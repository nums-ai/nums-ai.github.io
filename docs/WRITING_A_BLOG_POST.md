# Write and edit a blog post

The `.md` manuscript is the site's source. Edit it and save: the running
`npm run dev` preview updates automatically. There is no separate copy of the
article to synchronize. The shared template handles fonts, layout, images,
bylines, and the table of contents.

## Edit the current articles

- Ephris: `src/content/blog/ephris-a-new-graph-without-a-new-training-run.md`

Open the manuscript in your text editor and the article in the browser. The
information between the first two `---` lines is YAML frontmatter. The prose
starts immediately below it. For paragraph edits, change only that prose.
Keep results, qualifications, and figure captions consistent with the evidence.

## Create a draft

From the repository directory:

```bash
npm run blog:new -- your-post-slug
npm run dev
```

The command creates and registers `src/content/blog/your-post-slug.md` and creates
`public/blog/your-post-slug/` for images. It refuses to overwrite existing posts.
Use lowercase words separated by hyphens for the slug; it determines the URL.

Open `http://localhost:3000/blog/your-post-slug/`. If the development server was
already running when you created a new post, restart it to pick up the new URL.
Subsequent manuscript saves refresh automatically. Use the port printed by the
server if 3000 is occupied.

## Basic information

```yaml
---
slug: your-post-slug
status: draft
date: "2026-10-01"
author: Dooho Lee
title: Your article title
category: Research
summary: A description for search results and link previews.
cardSummary: One short sentence for the blog card.
readingMinutes: 5
---
```

| Field | Purpose |
| --- | --- |
| `title` | Full title; no manual line breaks. |
| `summary` | One or two sentences for search descriptions and link previews. |
| `cardSummary` | Optional short introduction on the listing; defaults to `summary`. |
| `author` | Author's display name; required for published posts. |
| `date` | Quoted `"YYYY-MM-DD"`; a quoted year is supported for older posts. |
| `category` | For example, `Research`, `Experiments`, `Model release`, or `Company news`. Filters come from listed posts. |
| `status` | `draft`, `published`, or `unlisted`. |
| `readingMinutes` | Optional positive whole number. |
| `hero` | Optional first image; also used for the thumbnail and share preview. |
| `resources` | Optional links at the end of the article. |
| `figures` | Dimensions and display settings for body images, keyed by filename. |

Use plain text in metadata. Quote values containing `: ` or `#`, and always quote
dates. For longer descriptions, YAML `>-` joins indented lines into one paragraph.
An optional `titleKeepTogether` can keep the exact final phrase together when it
fits; it neither inserts a line break nor changes the font size.

## Paragraphs and sections

Everything below the frontmatter is Markdown. Blank lines separate paragraphs.

```markdown
Open with the observation or question that starts the story.

A second paragraph develops one idea. Use **bold** for a key finding and
*italics* for emphasis. Add [a source](https://example.com) when needed.

## What we found {#what-we-found}

Describe the result, then explain how you reached it.

- One observation
- Another observation

### A closer look

This is a subsection within the same contents entry.
```

Text before the first `##` is the introduction. Every top-level `##` creates a
section and its contents link, in manuscript order. The optional `{#section-id}`
sets a stable URL fragment. Preserve existing IDs when revising published headings.
New English headings can omit it and get an automatic ID from their title.
Use an explicit ID for non-English headings. IDs must be unique, lowercase, and
hyphen-separated; `main` and `article-top` are reserved.

Use `###` for subsections. A post with no `##` sections omits the contents rail.
Headings inside code examples or optional details do not create contents entries.
Reference-style Markdown links work even when their definitions appear in a
different section. Use fenced code blocks for code. Raw HTML and JSX are not
needed for writing articles.

## Images

Keep assets in `public/blog/<slug>/`. Image URLs begin `/blog/<slug>/` without
`public`. Use descriptive alt text and the asset's actual dimensions. All images
use the shared design and stay static, with no enlarge button.

### First image and thumbnail

Add this inside the frontmatter:

```yaml
hero:
  src: /blog/your-post-slug/cover.png
  alt: Describe what the reader should understand from the image.
  width: 1600
  height: 900
  caption: Optional explanation below the image.
```

The layout displays this image first and uses it as the listing thumbnail and
social preview. Do not repeat it in the body. The thumbnail fits a 5:2 frame
without cropping.

### Body figures

Add dimensions under `figures` in the frontmatter:

```yaml
figures:
  result.png:
    width: 1200
    height: 800
    caption: Explain the result, units, and comparison.
    maxWidth: 530
```

Place the image on its own line in the body, with blank lines around it:

```markdown
![Describe what the comparison shows.](/blog/your-post-slug/result.png)
```

`maxWidth` is optional and controls display size, without changing the intrinsic
dimensions. Tall figures have a default 560px image height limit. For dense paper
figures, optional `minWidth: 640` allows horizontal scrolling on narrow screens,
with a scroll hint when needed. `minWidth` also works on the hero.

## Notes, tables, and optional details

The manuscript supports small extensions for shared presentation blocks.
A separate caption or table note:

```markdown
::caption[Explain the metric and what a better value means.]
```

An optional disclosure, with an optional stable ID:

```markdown
:::details[Experiment settings]{#experiment-settings}

Put supporting paragraphs here. **Emphasis**, lists, images, and tables work
inside the disclosure too.

:::
```

Small attribution text within a paragraph:

```markdown
:small[Figures reproduced from *Paper title*, by the authors.]
```

Use normal Markdown tables. A trailing colon aligns numerical columns right:

```markdown
| Method | Result |
| --- | ---: |
| Model A | 0.75 |
| Model B | 0.79 |
```

## Links at the end

Add resources to the frontmatter. Research posts normally end with the paper
and code links, keeping the main narrative free of repeated paper links.

```yaml
resources:
  - label: Read the paper
    href: https://arxiv.org/abs/your-paper-id
    external: true
  - label: View the code
    href: https://github.com/your-org/your-repo
    external: true
```

Use `external: false` for links within the website.

To group paper and code links with a citation before the references, place a
link row directly in the manuscript instead of using frontmatter `resources`:

```markdown
::links[[Read the paper](https://arxiv.org/abs/your-paper-id) [View the code](https://github.com/your-org/your-repo)]

:::references[References]

1. Authors. (Year). *Paper title*. Venue.
2. Authors. (Year). *Another paper title*. Venue.

:::
```

The references block uses smaller type and tighter list spacing. Its heading
does not create a contents entry.

## Review and publish

| Status | Local development | Production build |
| --- | --- | --- |
| `draft` | Normal listing and preview page | Omitted from listing and article routes |
| `published` | Normal listing and page | Normal listing and page |
| `unlisted` | Direct URL only | Direct URL only; still public |

Set `status: published` when ready for review. This makes the post eligible for
the next build; it does not deploy the site. Draft status is not a privacy
boundary: repository files and `public/` assets follow the repository's access.

Before requesting review:

```bash
npm run typecheck
npm run build
git diff --check
```

Check the listing, article, and mobile view. Follow the contents links, open
optional details, and verify figures and sources. Build validation catches
invalid metadata, duplicate slugs and section IDs, invalid dates, missing
published authors, and body images without dimensions or alt text.
It does not check the accuracy of the writing or measured results.

A pull request includes the manuscript, registry change, and image assets.
Follow the repository's review process before merging; pushing to `main` deploys.

## Shared design and translations

Authors edit manuscripts and images. Design changes belong in the common
components under `src/components/blog/`; parsing and rendering live in
`src/lib/markdown-blog.tsx`. Registration and draft visibility live in
`src/content/blog/index.ts`. The [design guide](BLOG_DESIGN.md) documents shared
widths, fixed font sizes, and review criteria.

Existing Korean translations live in `<slug>.ko.md` and are registered alongside
the English manuscript. They can override metadata alone or supply a translated
body. English remains the fallback when the translation has no body. YAML `null`
clears `titleKeepTogether` inherited from English. Only English routes are
currently published; new posts do not need translations.
