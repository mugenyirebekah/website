# Rebekah Mugenyi — Portfolio Site

Plain HTML/CSS/JS. No build step, no dependencies — open `index.html`
directly in a browser, or serve the folder with any static server.

## File structure

```
site/
├── index.html              Home page (intro line + scrolling project rows)
├── projects.html           Full project grid with tag filters
├── about.html               About page
├── press.html                Press / news coverage page
├── projects/                 One detail page per project
│   ├── hexapod.html
│   ├── transport-rover.html
│   ├── boost-converter.html
│   ├── titan-energy.html
│   ├── sydney-james.html
│   ├── range-crazy.html
│   ├── ueloce.html
│   └── madame-fc.html
├── css/
│   └── style.css             All styling — one shared stylesheet
├── js/
│   └── main.js                Mobile nav toggle, marquee loop, project filters
├── images/
│   ├── projects/              Project photos (currently placeholder SVGs)
│   ├── about/                 headshot.svg (placeholder)
│   └── icons/                 github.svg, email.svg, resume.svg, linkedin.svg,
│                               logo-mark-1.svg, logo-mark-2.svg (your monogram)
└── files/
    └── Rebekah_Mugenyi_CV_2026.pdf   Your real CV — already linked from the footer
```

Every page lives at the top level except project detail pages, which sit in
`/projects/` — that's why their internal links use `../` to get back to
`css/`, `js/`, `images/`, and `files/`. If you rename or move a page, check
the `<link>`, `<script>`, and `<img src>` paths in that file still resolve.

## Swapping in real photos

Every image in `images/projects/`, `images/about/`, is a placeholder SVG —
a solid color block with a filename label — sized to the right aspect
ratio so nothing will reflow when you swap it out. To replace one:

1. Drop your real photo into the matching folder, e.g. `images/projects/hexapod-1.jpg`.
2. Open the HTML file(s) referencing it and change the `src` to the new
   filename (or just reuse the same filename and overwrite the `.svg`
   with a same-named `.jpg`/`.png`, then update the extension in each
   `<img src="...">` and the marquee/gallery references).

Search for the filename across the project to find every place it's used
(most images appear on the home page, the project's detail page, and — for
the cover photo — `projects.html`):

```bash
grep -rl "hexapod-1" .
```

## Content still marked "placeholder" or "coming soon"

- **Titan Energy, Sydney James, Range Crazy, Uéloce, Madame FC** — these
  came from your wireframe with an image but no description. Each has a
  detail page in `projects/` with a "coming soon" case-study paragraph —
  edit the `long_desc` text directly in that file when you have the real
  copy.
- **Press page** (`press.html`) — the NTV and Daily Monitor entries show
  "Link coming soon" since you didn't have URLs yet. Once you do, open
  `press.html` and replace:
  ```html
  <span class="press-link disabled">Link coming soon</span>
  ```
  with:
  ```html
  <a class="press-link" href="YOUR_URL" target="_blank" rel="noopener">View coverage &rarr;</a>
  ```
- **LinkedIn icon** — `images/icons/linkedin.svg` is a plain placeholder
  mark (a black square with "in"). Swap the file with your preferred icon
  (keep the filename `linkedin.svg`, or update the `<img src>` in the
  footer of every page if you rename it).
- **Logo marks** (top-left of the header) — `images/icons/logo-mark-1.svg`
  and `logo-mark-2.svg` are simple generated monograms standing in for
  your two logo icons from the wireframe. Replace with your real marks.

## The scrolling rows

Each project on the home page is its own horizontally auto-scrolling row
(`.marquee-row`), looping continuously and pausing on hover (and on
touch, for mobile). This is handled in `css/style.css`
(`@keyframes scroll-left`) and `js/main.js` (which duplicates each row's
images so the loop is seamless). To adjust scroll speed, change the
`animation: scroll-left 28s linear infinite;` duration in `style.css`.

## Fonts

Loaded from Google Fonts via `@import` at the top of `style.css`:
- **Space Grotesk** — headings and display text
- **JetBrains Mono** — the `printf(...)` line, tags, labels, "See Project" links
- **Inter** — body copy

## Deploying

Since this is a static site with no build step, you can host it as-is on
GitHub Pages, Netlify, or Vercel — just push the whole `site/` folder as
the repo root (or point the host at this folder).
