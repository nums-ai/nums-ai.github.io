# Blog design system

## Reader experience

The listing helps readers choose a subject. The article helps them follow the
argument and inspect its evidence. Both use the site's white background, black
type, restrained borders, and familiar navigation.

### Discover a post

- Each card follows the same order: first image, category, title, short summary,
  and “Read full article”. The entire card is one link, named by its title.
- The image also opens the article; hover and keyboard focus cover the entire card.
- Thumbnails fit a 5:2 frame without cropping. The post's `hero` remains the
  source for its first image, thumbnail, and share image.
- Category filters come from the listed posts. Adding a category adds its filter.
- Cards use two equal columns above 850px and one column at narrower widths.
  This gives tablet titles and figures enough room, using fixed font sizes.
- Card titles use the font's natural letter spacing and balance their line lengths
  with CSS, keeping fixed font sizes and avoiding isolated final words.
  Summaries wrap naturally. Text-only posts use the same card without
  reserving an empty image slot.

### Read and inspect

- The reading column is at most 720px wide. It remains centered on wide screens,
  with a left contents rail and matching space on the right.
- Article titles wrap naturally across the available width, with fixed font sizes
  and natural letter spacing. They do not balance line lengths.
- At 1200px and below, the contents move below the title and byline. Opening
  a section closes the disclosure and moves to the matching heading.
- Section IDs supply both headings and contents links. Desktop contents track
  the section being read; headings clear the sticky site navigation.
- Figures preserve their aspect ratio. The default image height limit is 560px,
  helping readers compare a tall result without filling the whole screen.
  Authors can use `maxWidth` for a figure that needs a different display size.
- Dense paper figures can use `minWidth`. Their viewport scrolls independently;
  the scroll hint and keyboard focus appear only when the figure actually overflows.
- Supporting details use native disclosures with a plus/minus indicator. Figures
  remain inline, with no enlargement dialog.
- Article endings offer up to two other listed posts, preferring the same category,
  and a link to the full index. Draft visibility follows the existing development
  and production rules; unlisted posts are omitted from these suggestions.

## Shared settings

Change the common template rather than styling individual posts.

| Setting | Source | Default |
| --- | --- | --- |
| Listing width and site gutters | `homepage.module.css` | 1200px; shared responsive gutters |
| Font family | `--sans` in `homepage.module.css` | Shared system font stack: Helvetica Neue, Helvetica, Arial, and Korean fallbacks; no web font downloads |
| Article title | `blog.module.css` | 36px; 26px at 850px and below |
| Card title | `blog.module.css` | 28px; 24px at 850px and below |
| Reading width | `--blog-reading-width` | 720px |
| Contents width and column gap | `--blog-contents-width`, `--blog-column-gap` | 180px, 32px |
| Section spacing | `--blog-section-gap` | 64px; 48px at 640px and below |
| Default figure height limit | `--blog-figure-max-height` | 560px |
| Card padding | `.postCard` | 32px; 24px at 850px and below |
| Body and captions | `article.module.css` | 17px / 1.75; 14px / 1.65 |

Post content, author, dates, categories, and figures live in `src/content/blog/`.
The templates derive their layout and navigation from that data. See
[the writing guide](WRITING_A_BLOG_POST.md) to add a post.

## Review in a real browser

Check the listing and an article at desktop, tablet, and phone widths. Include
a wide paper figure, a tall result figure, and a long title when available.

- Can the reader identify the subject and choose a post quickly?
- Does the title appear before the mobile contents, and does the body remain readable?
- Are images proportionate, uncropped, and free from page-wide horizontal overflow?
- Do filters, full-card links, contents links, disclosures, and ending links work?
- Is keyboard focus visible, including within a figure that needs horizontal scrolling?
- Do newly added posts inherit the same template, with no post-specific layout rules?

Run `npm run typecheck` and `npm run build` after component or data changes.
Deliver the local preview and representative screenshots with a short explanation
of the main design decisions.
