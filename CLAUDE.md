# Portfolio (christiankamalu.com)

Vite + React 19 + TypeScript single-page portfolio. Zero runtime deps beyond
react/react-dom — keep it that way; animations are hand-rolled CSS.

- The site sells one thing: **websites for people and small businesses, on
  contract**. Hero, About, the Contact footer, and the `index.html` meta tags
  all carry that message — change one and change the rest, or the page starts
  hedging. It is deliberately not a job-hunt page any more; there is no "open
  to my next role" line to restore.
- That focus is layered, and the layers are not the same. The **headline layer**
  — `<title>`, the h1's `.sr-only` text, the hero, the Google Business Profile
  category — stays narrow, because a small business owner searching for a
  website reads breadth as "too big for my job" and leaves. The **depth layer**
  — About's closing paragraph, the Contact copy, Skills, the Workshop cards,
  and `knowsAbout` in the JSON-LD — carries the full full-stack range, so a
  client who needs a back end behind the site doesn't filter themselves out.
  Widening the headline to match the depth is the tempting edit and the wrong
  one; it was considered and declined.
- `CLIENT_SITES` (paid work, leads the Projects section) and `PROJECTS`
  (personal builds) are separate arrays of the same `Project` type. Client
  cards are the proof behind the pitch, so every `link` there must stay live —
  a dead link is worse than no card.
- All copy/content lives in `src/data.ts` (projects, experience, skills,
  links). Edit content there, not in components. The hover cross-highlight
  (`HighlightContext`) runs on project `tech` strings alone — hovering a chip
  on one card lights the other cards sharing it. The Skills chips are static
  labels: they used to drive it, but the cards sit ~800px above that section
  so the payoff fired off-screen (and `onMouseEnter` never fires on touch).
  Matching `SKILLS` spellings to `tech` is cosmetic now, not functional.
- The hero board is a split-flap sign, not decoration: clicking it flips
  through the pitch (name → what → who for → how far) and wraps back to the
  name, which is why index 0 must stay the name — it is what first paint and
  any crawler sees. Two couplings that will not fail loudly: `COLS` in
  Hero.tsx is also the `9` in the `--size` calc in styles.css (the board is
  padded to a fixed grid so it cannot reflow mid-flip or wrap on phones), and
  `TICK_MS` is also the `tile-flap` keyframe duration. Adding a longer line
  means bumping both.
- Never give a tile animation `animation-fill-mode: forwards`/`both`. A
  finished fill keeps applying its last keyframe, and a `transform` there
  outranks `.tile:hover` — that is exactly how the tile hover lift sat broken.
  `backwards` gives the staggered deal everything it needs.
- The site is **prerendered**: `npm run build` runs the client build, then an
  SSR build to `.ssr/`, then `scripts/prerender.mjs` splices the markup into
  `#root`. `main.tsx` hydrates when `#root` has an element child and falls back
  to `createRoot` when it doesn't, so `npm run dev` still works against the
  untouched index.html. Two rules keep it working: nothing in the tree may
  touch the DOM during render (browser APIs belong in `useEffect` or event
  handlers), and every `useState` initial value must be a constant — a
  `Math.random()` or `Date.now()` initialiser is a hydration mismatch. The
  `<link rel="preload" as="image">` that appears at the top of `#root` is
  React 19 hoisting the headshot preload; it belongs there, and moving it to
  `<head>` would break hydration.
- Reveal-on-scroll hides behind `.js`, a class an inline script in index.html
  puts on `<html>`. With the page prerendered, a bare `.reveal { opacity: 0 }`
  would serve a no-JS reader a blank page full of invisible text. Don't
  "simplify" it back, and don't reach for `<noscript><style>` instead —
  whether that applies depends on the parser's scripting flag rather than on
  whether script actually ran, which is not the same question.
- SEO lives in three places and they must agree: `SITE` in `src/data.ts` is
  the source of truth, the `structuredData` plugin in `vite.config.ts` turns it
  into static JSON-LD at build time, and `index.html` carries the hand-written
  meta tags. Build time, not runtime — this is a client-rendered SPA, so a
  crawler that doesn't run JS finds an empty `#root`; the `<noscript>` block in
  the body is the only body copy such a crawler ever sees, so keep it saying
  what the Hero and Footer say. Different content there would be cloaking.
- `SITE.serviceArea` is the local-SEO lever: `city`/`region` is the location
  claim (Layton, Utah — keep it true), `alsoServes` is reach without a location
  claim, which is legitimate only because the schema type is `Service` and not
  `LocalBusiness`. Setting `city` switches on the local `areaServed` nodes, the
  "Based in X" line in the footer, and the city in the `<title>` and meta
  description at once. Never move the claim to Salt Lake City for the volume:
  Layton is a principal city of the Ogden–Clearfield metro, not SLC's, and a
  location that contradicts the Business Profile and actual proximity ranks
  worse than an honest smaller one. The build hard-fails if the composed meta
  description passes 160 characters.
- The `<h1>` is the tile board, whose text content is a pile of single-letter
  spans with no spaces that changes on every flip. The `.sr-only` span inside
  it carries the real heading for screen readers and crawlers; if the hero copy
  changes, change that too.
- `public/og-image.png` is generated from `scripts/og-card.html` — open it in a
  headless browser at exactly 1200x630 and screenshot. Regenerate it the same
  way when the pitch changes; the card repeats the hero copy on purpose.
- Contact is a **Netlify Form**, not a `mailto:`. A mailto does nothing at all
  — no error, no tab, no feedback — for anyone without a desktop mail client,
  which silently killed the primary CTA. Never make a mailto the only path to
  reaching him; the address stays visible beside the form and in both failure
  states so there is no dead end. Netlify detects the form from the deployed
  HTML at build time, which works only because the page is prerendered, so the
  hidden twin in index.html is the guard against a silent regression — keep
  its field list identical to `ContactForm.tsx`, because Netlify only accepts
  fields it saw at deploy time.
- Icons are hand-rolled SVGs in `src/components/Icon.tsx` — one 24x24 grid,
  `currentColor` so they inherit surrounding CSS, cubics instead of arcs (sweep
  flags are unreadable later). No emoji in the UI: they render differently on
  every platform and screen readers announce them ("game die"). Add a glyph to
  `GLYPHS` rather than reaching for an icon library or a Unicode symbol.
- `MiniBoggle`'s `WORDS` list is a public claim — every word must actually be
  traceable on `BOARD` (adjacent-tile paths, diagonals allowed, no reuse).
  Verify with a quick DFS script if you touch either.
- No global `scroll-behavior: smooth` — it hijacks find-in-page, focus
  restores, and automated testing. Nav anchor clicks get smooth scrolling via
  `smoothAnchor` in App.tsx; `[id] { scroll-margin-top }` keeps targets clear
  of the sticky nav.
- `useReveal` returns a class string, not a bare ref — the `revealed` state is
  React state on purpose. Never set classes imperatively (`classList.add`) on
  an element React re-renders with a computed `className`: React rewrites the
  whole attribute and silently drops them. That bug once hid every project
  card at `opacity: 0` the first time a skill chip was hovered.
- Cards in the same project-grid row must keep constant height while idle —
  the NourishAI demo cycles content every 3.2s and once caused the whole row
  to jiggle (fixed with min-height + nowrap). Don't add idle animations that
  affect layout.
- `public/Christian-Kamalu-Resume.pdf` is generated from
  `C:\dev\resume\resume.html` with the phone number removed and
  "AI agents" wording aligned to "AI integrations" (printed to PDF via
  headless Chromium) — regenerate it the same way when the resume changes;
  never copy the raw PDF from the resume folder (it contains the phone
  number).
- Netlify builds from master with `netlify.toml` (Node pinned there — the
  site predates modern build images). The publish dir is `dist`. The catch-all
  serves `index.html` with status **404**, not 200 — there's no client-side
  router, so a 200 would turn every bad URL into a soft 404. If you ever add a
  router, flip that status back to 200 in the same commit.
