// Phase 2 news agent — run with: node agent/fetch-news.js
// Requires: npm install rss-parser (run once)

import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const INTERESTS = {
  'AI in Law': [
    'artificial intelligence', 'ai', 'generative ai', 'llm',
    'machine learning', 'chatgpt', 'legal ai', 'agentic',
  ],
  Regulation: [
    'ai act', 'gdpr', 'regulation', 'regulatory', 'compliance',
    'sra', 'ccbe', 'bar association', 'ethics',
  ],
  'In-House Counsel': [
    'in-house', 'general counsel', 'gc', 'legal department',
    'clo', 'chief legal officer', 'corporate counsel',
  ],
  'Legal Market': [
    'law firm', 'biglaw', 'legal market', 'billing', 'legal ops',
    'legal operations', 'alternative legal', 'newlaw', 'pricing',
  ],
  'Legal Tech': [
    'legal tech', 'legaltech', 'lawtech', 'software', 'platform',
    'automation', 'contract', 'e-discovery', 'legal innovation',
  ],
  'Legal Education': [
    'law school', 'legal education', 'training', 'skills',
    'curriculum', 'future lawyer',
  ],
  'Access to Justice': [
    'access to justice', 'pro bono', 'legal aid',
    'unmet legal need', 'self-represented',
  ],
}

function score(title, summary) {
  const text = `${title} ${summary}`.toLowerCase()
  const tags = []
  let total = 0
  for (const [category, keywords] of Object.entries(INTERESTS)) {
    const hits = keywords.filter(kw => text.includes(kw)).length
    if (hits > 0) {
      tags.push(category)
      total += hits
    }
  }
  return { tags, score: Math.min(total, 10) }
}

async function main() {
  const { default: Parser } = await import('rss-parser')
  const parser = new Parser({ timeout: 10000 })

  const sources = JSON.parse(readFileSync(join(ROOT, 'agent/sources.json'), 'utf8'))
  const cache = JSON.parse(readFileSync(join(ROOT, 'news-cache.json'), 'utf8'))

  const existingUrls = new Set(cache.articles.map(a => a.url))
  const cutoff = Date.now() - 72 * 60 * 60 * 1000
  const newArticles = []

  for (const source of sources) {
    try {
      console.log(`Fetching ${source.name}…`)
      const feed = await parser.parseURL(source.rss)
      for (const item of feed.items) {
        const date = new Date(item.pubDate ?? item.isoDate ?? Date.now())
        if (date.getTime() < cutoff) continue
        if (existingUrls.has(item.link)) continue

        const summary = (item.contentSnippet ?? item.summary ?? '').slice(0, 400)
        const { tags, score: s } = score(item.title ?? '', summary)

        if (s < 3) continue

        const id = item.link
          .replace(/https?:\/\//, '')
          .replace(/[^a-z0-9]+/gi, '-')
          .slice(0, 80)

        newArticles.push({
          id,
          title: item.title ?? 'Untitled',
          url: item.link,
          source: source.name,
          region: source.region,
          date: date.toISOString(),
          summary,
          tags,
          relevance: s >= 6 ? 'high' : 'medium',
          score: s,
        })
        existingUrls.add(item.link)
      }
    } catch (err) {
      console.warn(`  ✗ ${source.name}: ${err.message}`)
    }
  }

  // Merge and prune to 72h window
  const merged = [...newArticles, ...cache.articles].filter(
    a => new Date(a.date).getTime() > cutoff
  )

  // Sort newest first
  merged.sort((a, b) => new Date(b.date) - new Date(a.date))

  const updated = {
    lastUpdated: new Date().toISOString(),
    articles: merged,
  }

  writeFileSync(join(ROOT, 'news-cache.json'), JSON.stringify(updated, null, 2))
  console.log(`\n✓ Added ${newArticles.length} new articles. Total: ${merged.length}`)

  console.log('\nBuilding and deploying…')
  execSync('npm run build', { cwd: ROOT, stdio: 'inherit' })
  execSync('npx gh-pages -d dist', { cwd: ROOT, stdio: 'inherit' })
  console.log('✓ Deployed to GitHub Pages')
}

main().catch(err => { console.error(err); process.exit(1) })
