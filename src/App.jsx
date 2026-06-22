import { useState, useMemo, useEffect } from 'react'
import cache from '../news-cache.json'
import Header from './components/Header.jsx'
import FilterBar from './components/FilterBar.jsx'
import NewsCard from './components/NewsCard.jsx'

const SECTIONS = ['news', 'blog', 'bio']

function sectionFromHash() {
  const h = window.location.hash.replace('#', '').toLowerCase()
  return SECTIONS.includes(h) ? h : 'news'
}

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <p className="font-serif text-3xl text-[#F1F0EC] mb-2">{title}</p>
      <p className="text-[#76766F] text-sm tracking-wide">Coming soon.</p>
    </div>
  )
}

export default function App() {
  const [section, setSection] = useState(sectionFromHash)
  const [region, setRegion] = useState('All')
  const [tag, setTag] = useState('All')

  useEffect(() => {
    const onHash = () => setSection(sectionFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  function go(s) {
    if (window.location.hash.replace('#', '') !== s) window.location.hash = s
    setSection(s)
  }

  const filtered = useMemo(() => {
    return cache.articles.filter(a => {
      const regionMatch = region === 'All' || a.region === region
      const tagMatch = tag === 'All' || a.tags.includes(tag)
      return regionMatch && tagMatch
    })
  }, [region, tag])

  return (
    <div className="min-h-svh bg-[#0F1012]">
      <Header lastUpdated={cache.lastUpdated} section={section} onSection={go} />

      {section === 'news' && (
        <>
          <FilterBar region={region} tag={tag} onRegion={setRegion} onTag={setTag} />
          <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-[#C9C8C4] font-medium mb-1">No articles found</p>
                <p className="text-[#76766F] text-sm">Try a different region or topic.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {section === 'blog' && (
        <main className="max-w-4xl mx-auto px-5 sm:px-8">
          <ComingSoon title="Blog" />
        </main>
      )}

      {section === 'bio' && (
        <main className="max-w-4xl mx-auto px-5 sm:px-8">
          <ComingSoon title="Bio" />
        </main>
      )}

      <footer className="max-w-4xl mx-auto px-5 sm:px-8 py-8 mt-2 border-t border-[#2A2B2F]">
        <p className="text-[#6E6E6C] text-[11px] text-center tracking-wider">
          A personal trial project — experimental and for testing purposes only.
        </p>
      </footer>
    </div>
  )
}
