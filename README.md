# Nums AI website

The Nums AI website at [nums.world](https://nums.world), built with Next.js,
React, TypeScript, and CSS Modules. Pages are statically exported and published
through GitHub Pages. Images, fonts, styles, and scripts are served locally;
external links are only opened when a visitor follows them.

## Development

Use Node.js 20.9 or newer and npm.

```bash
npm ci
npm run dev
```

## Build and preview

```bash
npm run typecheck
npm run build
npm start
```

The build writes `out/`. `npm start` serves that directory at
`http://127.0.0.1:3000` using Python 3, with no Next.js server required.

To create the self-contained HTML for sharing:

```bash
npm run share
```

Open `artifacts/nums-ai.html` directly in a browser. Images, styles, page content,
and interactions are embedded, including the dataset explorer and Careers
outline. The export also writes `artifacts/nums-homepage-preview.html` for
compatibility and `out/preview.html` for local review. To export an existing
build without rebuilding, run `npm run export:preview`.

Generated files in `out/`, `.next/`, and `artifacts/` are ignored by Git.
Run the export again after every build to refresh the shareable HTML.

## Structure

- `src/app/`: page routes, metadata, global reset, and Careers content.
- `src/components/homepage/`: homepage sections, navigation, footer, animated
  Causilo figure, performance chart, and Python quick start.
- `src/components/use-cases/`: dataset explorer, metric plots, and generated scores.
- `src/components/blog/`: Shared blog listing, article layout, contents, and blocks.
- `src/content/blog/`: One file per blog post, a starter template, and the registry.
- `public/`: brand assets, investor logos, hero image, and custom-domain settings.
- `data/use-cases/`: dataset descriptions, domain assignments, and source metadata.
- `scripts/`: benchmark data builders and standalone HTML exporter.

Only English routes are published: `/`, `/use-cases/`, `/blog/`, `/careers/`,
and `/careers/en/`. Existing Korean Markdown translations are retained for future use.

## Write a blog post

Start with the [step-by-step writing guide](docs/WRITING_A_BLOG_POST.md).

```bash
npm run blog:new -- your-post-slug
npm run dev
```

The command creates and registers a draft in `src/content/blog/your-post-slug.md`
and creates its image directory. Edit that one file for the title, author, date,
summary, and prose. The manuscript is the site’s source; saving it updates the
running development preview. The common template renders the design and creates
the table of contents from Markdown `##` headings. `hero` is the single
source for the first image, listing thumbnail, and Open Graph image.

Drafts appear in the normal listing during local development and are omitted from
production pages. Category filters are created from the posts currently listed.
Set `status: published` when ready for review and the next deployment. `unlisted`
posts remain available at their public URLs without appearing in the listing.
The existing Causilo release and funding posts retain their URLs and unlisted status.
The generator refuses to overwrite an existing post.

The listing inherits the site's shared 1200px width and font. Posts use a two-column
grid (one column at 850px and below), showing the first image, category, title, a short introduction,
and a “Read full article” cue. Use optional `cardSummary` for the introduction;
it falls back to `summary`. Cards have 32px padding (24px at 850px and below). Thumbnails
fit a shared 5:2 frame without cropping. Category filters remain above the grid.
Each card is one clickable area with rounded borders and a subtle hover overlay
covering the image and all of its text.
Articles share the site's system font stack, a centered 720px reading column, a 180px desktop
contents rail, and static inline images. At 1200px and below, the contents become
a disclosure after the title and byline. Tall figures fit a 560px image height limit;
wide paper figures scroll within their own region when necessary, with an accurate
scroll hint. Each article ends with links to other listed posts and the blog index.
Title sizes are fixed at 36px/26px (desktop/mobile), card titles at 28px/24px,
body text at 17px, and section headings at 28px/24px. Edit the shared CSS rather
than adding post-specific style rules. No image enlargement UI is used.
See [the blog design system](docs/BLOG_DESIGN.md) for shared rules and review criteria.

The Ephris article lives in
`src/content/blog/ephris-a-new-graph-without-a-new-training-run.md`. Its figures
come from the paper; preserve the claims, source metadata, citations, and figures
together when editing. Assets live under `public/blog/<slug>/`.

## Design and interactions

Page backgrounds span the viewport, with a shared 1200px content width. The
navigation switches to its mobile menu at 850px. The Careers outline appears
at 1100px, tracks the visible section, and toggles position disclosures.

The Causilo figure uses inline SVG and CSS animation, including regression,
classification, and forecasting examples. Reduced-motion mode presents completed
prediction cells without animation. The Elo chart supports hover and keyboard
focus, with legend controls for baseline configurations. The dataset selector
supports keyboard navigation and domain/dataset query parameters. Shared
controllers power both the Next.js pages and the standalone HTML.

## Benchmark data

The committed JSON files allow builds without the original CSV exports or a
network connection. The generators retain source filenames and SHA-256 hashes.
Do not replace measured results with illustrative values.

### Homepage Elo chart

The homepage shows Causilo and four tree-based families: Random Forest, XGBoost,
CatBoost, and LightGBM. Baselines have default, tuned, and tuned + ensembled
configurations; Causilo uses its default configuration. The original data covers
51 datasets, 816 splits per configuration, and 83 configurations. Scores retain
the full evaluation's Elo values; they are not recalculated for the displayed
subset. The source's `rank` column is average task rank, not ordinal Elo rank.

Error bounds and additional model families remain in the source JSON for
provenance. The displayed chart omits error bars and the y-axis title. SVG bars
are rendered directly from `src/components/homepage/benchmark-data.json`, without
a charting library.

Regenerate the data with Python 3 (standard library only):

```bash
python3 scripts/build-benchmark.py \
  --leaderboard /path/to/tabarena_leaderboard_official.csv \
  --splits /path/to/results_per_split_official.csv
```

### Use Cases

The page displays 45 datasets across eight domains, selected from 51 source
datasets. A dataset is included only when Causilo's default mean strictly beats
every comparison model in all three configurations. The domains organize
benchmark tasks; they do not represent customer deployments.

Charts compare Causilo's default with tuned + ensembled CatBoost, LightGBM,
XGBoost, Random forest, Extra trees, linear/logistic regression, and k-nearest
neighbors. Each score is the arithmetic mean over matching splits. ROC AUC is
`1 - metric_error`; Log Loss and RMSE use `metric_error` directly. The generated
JSON retains split standard deviations; the website makes no confidence-interval
or significance claims.

Within each dataset, dot positions run linearly from the worst score on the left
to Causilo on the right: `100 * (score - worst) / (Causilo - worst)`. This reverses
error metrics so better performance always moves right. Original scores and
metric labels remain visible; positions do not represent score ratios.

Each domain initially selects the dataset with the largest relative error
reduction over its best tuned + ensembled competitor:
`(best competitor error - Causilo error) / best competitor error`. Error means
`1 - ROC AUC`, Log Loss, or RMSE. Remaining options shuffle once per visit.

Descriptions and domain assignments live in `data/use-cases/catalog.json`.
OpenML IDs, source links, dimensions, and pinned TabArena metadata provenance
live in `data/use-cases/dataset-metadata.json`.

```bash
python3 scripts/build-use-cases.py --splits /path/to/results_per_split_official.csv
```

The builder rejects duplicate, missing, imputed, non-finite, mismatched-metric,
and unmatched-split records. Rebuild the website after regenerating either JSON.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`: `npm ci`, production
build, and deployment of `out/` to GitHub Pages. Preserve `public/CNAME`.
Standalone review HTML is generated locally and is not part of deployment.

Before pushing, run the type check and build, inspect desktop/mobile layouts and
interactions, verify local asset responses, and review `git diff --check` and the
staged diff. Do not commit credentials, local exports, or private source files.
