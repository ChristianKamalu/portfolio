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
- Netlify builds from master with `netlify.toml` (Node pinned there — the
  site predates modern build images). The publish dir is `dist`.
