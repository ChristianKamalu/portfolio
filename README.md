# christiankamalu.com

Personal portfolio — an interactive single-page React app.

- **Stack**: React 19 + TypeScript + Vite. No other runtime dependencies.
- **Deploys**: Netlify, auto-built from `master` (see `netlify.toml`), served at
  [christiankamalu.com](https://www.christiankamalu.com).
- **The fun parts**: the hero is a split-flap board that flips through the
  pitch and back to the name, the Bank card is a playable one-turn version of
  the real game, the Boggle card hides 25 traceable words, and hovering a tech
  chip lights up the other project cards sharing it.

- **Prerendered**: `npm run build` renders the whole page to static HTML and
  splices it into `#root`; the client hydrates it. Crawlers and readers
  without JS get the real page, not an empty div.
- **SEO**: `SITE` in `src/data.ts` drives the JSON-LD, which `vite.config.ts`
  writes into the HTML at build time. `SITE.serviceArea` drives the local-SEO
  copy and schema.

## Develop

```
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build to dist/
```

Content lives in `src/data.ts` — `CLIENT_SITES` (paid work) and `PROJECTS`
(personal builds) plus jobs, skills, and links.
