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

function Bio() {
  return (
    <main className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <h2 className="font-serif text-[26px] sm:text-[30px] font-semibold text-[#F4F3EF] mb-6 leading-tight">
        Javier Illescas
      </h2>
      <div className="font-serif text-[16px] leading-[1.75] text-[#CFCEC9] space-y-5">
        <p>
          Javier Illescas became Group Head of Legal at Banco Santander in 2024, having
          been with the Bank since 2012, including as Group Head of Business Legal and
          Group Head of Corporate Legal.
        </p>
        <p>
          Prior to joining the Bank in 2012, Javier was a corporate finance partner with
          Spanish law firm Uría Menéndez, then based in the Madrid office. Javier also did
          a stint in the firm&rsquo;s Buenos Aires office from 2001 to 2002 and a secondment
          to the New York office of Davis Polk in 2006. Whilst with Uría Menéndez, his
          practice focused on M&amp;A, banking and finance, and capital markets, all with a
          special emphasis on cross-border work.
        </p>
        <p>
          Javier is a Spanish national, admitted to practice in Spain, and holds a double
          degree in Law and Business Administration from ICADE&ndash;Universidad Pontificia
          Comillas in Madrid, where he also lectures on corporate and commercial law.
        </p>
      </div>
      <a
        href="https://www.linkedin.com/in/javier-illescas/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 mt-9 text-[#3FA06E] hover:text-[#5FBE92] text-sm font-medium transition-colors"
      >
        Connect on LinkedIn
        <span aria-hidden="true">&#8599;</span>
      </a>
    </main>
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

      {section === 'bio' && <Bio />}

      <footer className="max-w-4xl mx-auto px-5 sm:px-8 py-8 mt-2 border-t border-[#2A2B2F]">
        <p className="text-[#6E6E6C] text-[11px] text-center tracking-wider">
          A personal trial project — experimental and for testing purposes only.
        </p>
      </footer>
    </div>
  )
}
