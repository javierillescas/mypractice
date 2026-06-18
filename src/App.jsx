import { useState, useMemo } from 'react'
import cache from '../news-cache.json'
import Header from './components/Header.jsx'
import FilterBar from './components/FilterBar.jsx'
import NewsCard from './components/NewsCard.jsx'

export default function App() {
  const [region, setRegion] = useState('All')
  const [tag, setTag] = useState('All')

  const filtered = useMemo(() => {
    return cache.articles.filter(a => {
      const regionMatch = region === 'All' || a.region === region
      const tagMatch = tag === 'All' || a.tags.includes(tag)
      return regionMatch && tagMatch
    })
  }, [region, tag])

  return (
    <div className="min-h-svh bg-[#0f1117]">
      <Header lastUpdated={cache.lastUpdated} />
      <FilterBar
        region={region}
        tag={tag}
        onRegion={setRegion}
        onTag={setTag}
      />

      <main className="max-w-4xl mx-auto px-4 py-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-slate-300 font-medium mb-1">No articles found</p>
            <p className="text-slate-500 text-sm">Try a different region or topic filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map(article => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto px-4 py-6 mt-4 border-t border-slate-800">
        <p className="text-slate-600 text-xs text-center">
          (My) Practice News · Javier Illescas · Group Head of Legal, Banco Santander
        </p>
      </footer>
    </div>
  )
}
