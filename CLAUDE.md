# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this app is

**My Practice News** — a personal legal news aggregator for Javier Illescas (Group Head of Legal, Banco Santander). It fetches RSS feeds from legal publications, scores articles by keyword relevance, and serves a dark-themed mobile-first React UI hosted on GitHub Pages.

- Live URL: **https://javierillescas.github.io/mypracticenews/**
- Repo: **https://github.com/javierillescas/mypracticenews**

## Commands

```bash
npm run dev                  # local dev server
npm run build                # production build → dist/
npm run deploy               # build + push dist/ to gh-pages branch (local use only)
node agent/fetch-news.js     # fetch real RSS articles, rebuild, and deploy
```

## Pushing to GitHub

The macOS Keychain interferes with git credentials. Always push like this:

```bash
git -c credential.helper='' push https://javierillescas:TOKEN@github.com/javierillescas/mypracticenews.git main
```

**Token requirements:** Must be a **classic PAT** (`ghp_` prefix) with both `repo` and `workflow` scopes. Fine-grained tokens (`github_pat_`) do not work with git push over HTTPS for this repo. Generate at https://github.com/settings/tokens — click "Generate new token (classic)".

If the push is rejected because the remote is ahead, pull first:
```bash
git stash
git -c credential.helper='' pull --rebase https://javierillescas:TOKEN@github.com/javierillescas/mypracticenews.git main
git stash pop
# resolve any conflicts, then push
```

## Architecture

### Data flow
```
agent/fetch-news.js  →  news-cache.json  →  Vite build  →  dist/  →  gh-pages branch  →  GitHub Pages
```

`news-cache.json` is the single source of truth. It is imported statically at build time by Vite (`import cache from '../news-cache.json'` in `App.jsx`). There is no backend or API — the entire site is static HTML/JS.

### Agent (`agent/fetch-news.js`)
- Reads sources from `agent/sources.json`
- Fetches RSS via `rss-parser`, skipping articles older than 72h
- Scores each article by counting keyword hits across 7 interest categories (the `INTERESTS` object at the top of the file)
- Score ≥ 6 → `relevance: "high"`, score 3–5 → `relevance: "medium"`, score < 3 → discarded
- Merges new articles into `news-cache.json`, pruning anything older than **30 days**
- Detects `process.env.CI` to switch gh-pages deployment between local and GitHub Actions modes

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
- `src/components/FilterBar.jsx` — two rows of sticky filter pills (5 regions + 7 topic tags)
- `src/components/NewsCard.jsx` — article card with source, flag emoji, relevance dot, tags, relative time
- `src/components/Header.jsx` — sticky header with "My Practice" title and relative `lastUpdated` time
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite` plugin). Dark theme (`#0f1117` background), monochrome white/slate palette — no colour accents.
- `vite.config.js` has `base: '/mypracticenews/'` — required for GitHub Pages asset paths. Do not remove.

### GitHub Actions (`/.github/workflows/update-news.yml`)
- Runs daily at `0 6 * * *` (6am UTC = 7am Madrid CET / 8am CEST)
- Can be triggered manually from the GitHub Actions UI (workflow_dispatch)
- Uses the built-in `GITHUB_TOKEN` — no secrets need to be configured
- After running the agent, commits the updated `news-cache.json` back to `main` so the next run has the correct deduplication baseline
- **The workflow must not have a "Send email digest" step** — that step was removed; re-adding it without valid GMAIL secrets will cause the workflow to fail silently every day

### RSS sources (`agent/sources.json`)
8 working feeds: Artificial Lawyer, Legal Futures, LawNext, Legal IT Insider, Legal Evolution, Above the Law, ABA Journal, Thomson Reuters Legal Blog. To add a source, append `{ "name", "rss", "region" }` — no other changes needed.

## Adding or changing interest categories
Edit the `INTERESTS` object in `agent/fetch-news.js`. Each key is a tag name rendered in the UI — it must also be added to the `TAGS` array in `src/components/FilterBar.jsx`. Both files must stay in sync.
