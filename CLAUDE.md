# Portfolio (christiankamalu.com)

Vite + React 19 + TypeScript single-page portfolio. Zero runtime deps beyond
react/react-dom — keep it that way; animations are hand-rolled CSS.

- All copy/content lives in `src/data.ts` (projects, experience, skills,
  links). Edit content there, not in components. Skill names in `SKILLS` must
  match project `tech` spellings exactly — that string equality powers the
  hover cross-highlight (`HighlightContext`).
- `MiniBoggle`'s `WORDS` list is a public claim — every word must actually be
  traceable on `BOARD` (adjacent-tile paths, diagonals allowed, no reuse).
  Verify with a quick DFS script if you touch either.
- No global `scroll-behavior: smooth` — it hijacks find-in-page, focus
  restores, and automated testing. Nav anchor clicks get smooth scrolling via
  `smoothAnchor` in App.tsx; `[id] { scroll-margin-top }` keeps targets clear
  of the sticky nav.
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
