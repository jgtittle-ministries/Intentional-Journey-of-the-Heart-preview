# IJH Design Preview — Handoff to Claude Code

A static-site design preview for the *Intentional Journey of the Heart* corpus by John G. Tittle. Six volumes + an introduction, rendered in a warm-paper editorial template with a markdown reader for chapter content.

This is a **static site only** — no build, no dependencies. Drop the files on any static host and it works.

---

## Project structure

```
/
├── index.html                    Home page (reading paths, volume index)
├── Introduction.html             Intro landing (four axioms, formation docs)
├── Volume 1.html  …  Volume 5.html   Per-volume landing pages
├── Volume 6 Governance.html      Vol 6 — fully hand-styled hi-fi page
├── reader.html                   Generic chapter reader (loads markdown)
├── reader.js                     Markdown parser + reader page logic
├── manifest.js                   Generated chapter manifest (titles, prev/next)
├── styles.css                    All design tokens + component styles
└── docs/                         Source markdown mirror — DO NOT MOVE
    ├── introduction/
    ├── volume-1-laws-of-the-spirit/
    │   ├── *.md                  Each chapter
    │   └── images/               Per-volume image folder
    ├── volume-2-knowing-to-doing/
    ├── volume-3-quantitative-framework/
    ├── volume-4-testing-framework/
    ├── volume-5-references/
    └── volume-6-governance/
```

`docs/` is a verbatim mirror of the upstream repo's `docs/` folder. It exists at this path because the reader does `fetch('docs/<volume>/<chapter>.md')` — moving or renaming this folder breaks the reader.

---

## How the reader works

`reader.html` is a single generic chapter shell. It reads the chapter path from `location.hash`:

```
reader.html#docs/volume-1-laws-of-the-spirit/exploration-01-how-to-get-faith.md
```

`reader.js` then:
1. Looks up the chapter in `manifest.js` to get the volume context, prev/next, and title
2. `fetch()`-es the markdown file
3. Runs an inline markdown parser → HTML
4. Inserts the HTML into the page chrome (top nav, sidebar TOC for that volume, right rail with progress + source path + live-site link, chapter-foot prev/next)

The markdown parser handles: headings, paragraphs, bold/italic, inline code, code blocks, lists (nested), blockquotes, tables, horizontal rules, MkDocs-style admonitions (`!!! info "title"`), images, and internal `.md` links (auto-rewritten to `reader.html#docs/…`).

### Long-chapter mode
Chapters with 4+ H2s or > 30k characters automatically get a **chapter banner** (sections / subsections / words / reading time) and the right rail switches from source-info to an in-chapter outline with active-section tracking. Triggered automatically — no config.

### Why hash routing
The Volume 6 design preview iframe / tab system stripped query strings, so the reader was switched from `?path=…` to `#…`. All 147 internal links across the landing pages and reader navigation use the hash form.

---

## What's verbatim vs. styled

The user (John G. Tittle / project owner) explicitly required that **all body prose be verbatim source**. Editorial composed text is limited to:

- Eyebrows above headings (e.g. *"From the Introduction"*, *"Volume Six · Governance Framework"*)
- Section/part numerals (Part 1 / §5 / Tier 1)
- Page meta-rows (Source / Edition / License)
- Pull-quote captions on Vol 6 (e.g. *"The Benedictine answer"*)
- Hero subtitles on Vol 1–5 landing pages (each one was an explicit user decision to keep)
- One-line composed taglines under each volume card on home/Introduction
- Reading-path route pills (`READ ME FIRST → INTRO → VOL 1`)
- Numbered "claim-row" card structure for axioms / 5-things-that-follow / Formation Documents
- 4-cell "Connect" diagram framing labels (`Precondition / Trust / Discernment / Calling`)
- 3-cell "tier card" labels (`Tier 1 — Anchor claims` etc.)
- Small-caps `<span class="sub">` descriptors under some TOC items

**Important:** do not rewrite paragraphs that come from `docs/*.md`. The source is canonical. If you need to update body text, edit the markdown in `docs/` and the reader will pick it up. The hand-styled Vol 6 page is the one exception — its body prose is hard-coded in `Volume 6 Governance.html` and copied verbatim from `docs/volume-6-governance/*.md` so it can be visually composed (cards, pull-quotes, etc.). If the upstream Vol 6 markdown changes, that page must be hand-edited to match.

### Tier language
The user replaced all numeric confidence percentages (e.g. *"90%"*) with three-tier language (*"Anchor / Working / Frontier"*) across Vol 6 prose and the registry tables on home and Vol 6. Do not reintroduce percentages in editorial text. The two embedded dependency-diagram PNGs (in Vol 6 §2) still contain percentage labels because they're bitmap images from the source; that's fine.

---

## Design system

**Palette** — warm paper background (`oklch(0.97 0.012 75)`), warm near-black text, burnt-amber accent for illumination, deeper indigo for secondary, cranberry/forest for warning/anchor tiers. Defined as CSS custom properties at the top of `styles.css`.

**Type** — Cormorant Garamond (display), Source Serif 4 (body), JetBrains Mono (labels/data), Inter Tight (sans, rarely used). All loaded from Google Fonts.

**Components** — see `styles.css` for full inventory. Key reusable patterns:
- `.hero` + `.eyebrow` + `.title` + `.subtitle` + `.meta-row`
- `.key-claim` (hero callout box)
- `.part-header` + `.part-num` + `.part-title` + `.part-deck`
- `.prose` / `.prose-wide` / `.reader-prose` (editorial body styles)
- `.pullquote` (with optional `.attr` caption)
- `.claim-row` (numbered card list)
- `.tier-grid` + `.tier` (3-up card grid with stripe color)
- `.connects` + `.connect` (4-up Connect diagram)
- `.viz` + `.reg-table` (data block with table)
- `.rule-block` (centerpiece liturgical panel)
- `.role-card` (2-up role description)
- `.live-banner` (source-of-truth callout)
- `.toc-card-list` + `.toc-card` (chapter TOC entries)
- `.home-vol` (volume index row)
- `.foot-nav` (prev/next at bottom of pages)
- `.topnav-wrap` + `.topnav` (top brand strip with volume nav)
- `.shell` (3-column reader layout) / `.shell-single` (centered single-col)

---

## Deployment

This is a static site. Drop on any host. Two recommended paths:

### Option A — separate branch in the existing upstream repo
1. In `jgtittle-ministries/Intentional-Journey-of-the-Heart-dev`, create a branch called `design-preview` (or similar)
2. Commit these files at the branch root (preserving `docs/` mirror structure)
3. In repo Settings → Pages, deploy from this branch
4. Lives alongside the canonical MkDocs site at a separate URL

### Option B — separate repo
1. Create `Intentional-Journey-of-the-Heart-design` (or `-preview`)
2. Push everything to `main`, turn on Pages from main
3. Fully isolated

### Important caveats
- **Don't move `docs/`** — the reader's fetch paths depend on it living at the root
- **Keep `manifest.js`** — it has the ordered chapter list per volume (for sidebar TOC + cross-volume prev/next)
- **GitHub Pages serves under a subpath** (e.g. `/<repo>/`) unless using a custom domain. The reader uses **relative** paths everywhere (`docs/…`, not `/docs/…`), so subpath hosting works fine
- **No build step required** — there is no package.json, no node_modules. Pages will serve the files as-is

### If the upstream `docs/` changes
The markdown is a snapshot. If chapters are added/renamed/reordered upstream:
1. Re-import the changed files into the `docs/` mirror
2. Regenerate `manifest.js` — see the structure inside (titles + per-volume ordered arrays + prev/next pointers). For now this is hand-maintained; if you want a generator script, walk `docs/`, parse each `.md` for its first `# heading` as title, and emit the same shape

---

## Things Claude Code might want to do next

- Add a small static-site build step that regenerates `manifest.js` automatically from the `docs/` tree (e.g. a `npm run build` that walks the folder)
- Add a GitHub Action that runs the manifest regen on every push to `docs/`
- Add a search index (lunr.js or similar) — markdown content is small enough that client-side search is trivially fast
- Add print stylesheet (`@media print`) so any chapter can be printed as a clean PDF
- Add a "dark mode" toggle that flips the tokens back to the original midnight palette (the user moved to light; preserve the dark as an option)
- Add Open Graph / Twitter Card meta tags for sharing
- Resize the large source PNGs (some are 1–2MB) — they're decorative diagrams and could be 200–400KB without quality loss

---

## License

Content (markdown in `docs/`) is CC BY 4.0 per Volume 6 §10.
Design preview HTML/CSS/JS — match the upstream license, or whatever the project owner specifies.
