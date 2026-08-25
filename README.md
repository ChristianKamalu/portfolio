# christiankamalu.com

Personal portfolio — an interactive single-page React app.

- **Stack**: React 19 + TypeScript + Vite. No other runtime dependencies.
- **Deploys**: Netlify, auto-built from `master` (see `netlify.toml`), served at
  [christiankamalu.com](https://www.christiankamalu.com).
- **The fun parts**: the hero name is a Boggle-style tile board (click to
  re-deal), the Bank card is a playable one-turn version of the real game, the
  Boggle card hides 25 traceable words, and hovering a skill lights up the
  projects that use it.

## Develop

```
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
```

Content (projects, jobs, skills, links) lives in `src/data.ts`.
