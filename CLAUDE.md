# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

**My Practice News** — a personal legal news aggregator for Javier Illescas (Group Head of Legal, Banco Santander). It fetches RSS feeds from legal publications, scores articles by keyword relevance, and serves a dark-themed mobile-first React UI hosted on GitHub Pages.

Live URL: **https://javierillescas.github.io/mypracticenews/**
Repo: **https://github.com/javierillescas/mypracticenews**

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build → dist/
npm run deploy       # build + push dist/ to gh-pages branch (local use)
node agent/fetch-news.js   # fetch real RSS articles, rebuild, and deploy
```

To push to GitHub from the terminal, credentials must be passed explicitly (macOS Keychain interferes):
```bash
git -c credential.helper='' push https://javierillescas:TOKEN@github.com/javierillescas/mypracticenews.git main
```
The working token is a **classic PAT** (`ghp_` prefix) with `repo` + `workflow` scopes. Fine-grained tokens (`github_pat_`) do not work with git push over HTTPS for this repo.

## Architecture

### Data flow
```
agent/fetch-news.js  →  news-cache.json  →  Vite build  →  dist/  →  gh-pages branch  →  GitHub Pages
```
- `news-cache.json` is the single source of truth. It is imported statically at build time by Vite (`import cache from '../news-cache.json'` in `App.jsx`). There is no backend or API — the entire site is static.
- The agent runs locally or via GitHub Actions. In CI, it detects `process.env.CI` and uses `GITHUB_TOKEN` for the gh-pages push. Locally it uses the git remote configured in the repo.
- After the agent runs in CI, the workflow commits the updated `news-cache.json` back to `main` so the next run has the correct deduplication baseline.

### Relevance scoring (`agent/fetch-news.js`)
- Articles are fetched from RSS feeds defined in `agent/sources.json`
- Each article is scored by counting keyword hits across 7 interest categories (defined in the `INTERESTS` object at the top of `fetch-news.js`)
- Score ≥ 6 → `relevance: "high"`, score 3–5 → `relevance: "medium"`, score < 3 → discarded
- Fetch window: last **72 hours** (RSS feeds don't go back further)
- Retention window: **30 days** (articles older than 30 days are pruned from `news-cache.json`)

### news-cache.json schema
```json
{
  "lastUpdated": "ISO timestamp",
  "articles": [{
    "id": "url-derived-slug",
    "title": "...",
    "url": "...",
    "source": "Publication name",
    "region": "US | UK | EU | Global",
    "date": "ISO timestamp",
    "summary": "contentSnippet from RSS, max 400 chars",
    "tags": ["AI in Law", "Regulation", ...],
    "relevance": "high | medium",
    "score": 0-10
  }]
}
```

### Frontend
- `src/App.jsx` — loads `news-cache.json`, manages region/tag filter state, renders the grid
- `src/components/FilterBar.jsx` — sticky filter pills (regions + 7 topic tags)
- `src/components/NewsCard.jsx` — individual article card with source, flag, relevance dot, tags
- `src/components/Header.jsx` — sticky header with "My Practice" title and relative `lastUpdated` time
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Dark theme, `#0f1117` background, monochrome white/slate palette — no colour accents.
- `vite.config.js` has `base: '/mypracticenews/'` — required for GitHub Pages asset paths.

### Automation
- `.github/workflows/update-news.yml` runs daily at `0 6 * * *` (6am UTC = 7am Madrid CET / 8am CEST)
- Can be triggered manually from the GitHub Actions UI (workflow_dispatch)
- Uses the built-in `GITHUB_TOKEN` — no secrets need to be configured

### RSS sources (`agent/sources.json`)
8 working feeds: Artificial Lawyer, Legal Futures, LawNext, Legal IT Insider, Legal Evolution, Above the Law, ABA Journal, Thomson Reuters Legal Blog. To add a source, append an entry with `{ "name", "rss", "region" }` — no other changes needed.

## Adding or changing interest categories
Edit the `INTERESTS` object in `agent/fetch-news.js`. Each key is a tag name that appears in the UI (must match the `TAGS` array in `src/components/FilterBar.jsx`). Adding a new category requires updating both files.
