const FLAG = { US: '🇺🇸', UK: '🇬🇧', EU: '🇪🇺', Global: '🌐' }

function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (hours < 48) return 'Yesterday'
  return `${days} days ago`
}

export default function NewsCard({ article }) {
  const { title, url, source, region, date, summary, tags, relevance } = article
  const isHigh = relevance === 'high'

  return (
    <article className="
      bg-[#161b27] border border-slate-800 rounded-xl p-4
      transition-all duration-150
      hover:border-slate-600 hover:shadow-lg hover:shadow-black/30
      active:scale-[0.99]
    ">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <span>{FLAG[region] ?? '🌐'}</span>
          <span className="font-medium text-slate-300 tracking-wide">{source}</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px] uppercase tracking-widest">
            {region}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${isHigh ? 'bg-emerald-400' : 'bg-amber-400'}`}
            title={isHigh ? 'High relevance' : 'Medium relevance'}
          />
          <span className="text-slate-500 text-xs">{relativeTime(date)}</span>
        </div>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-white font-semibold text-sm sm:text-base leading-snug mb-2 hover:text-slate-300 transition-colors"
      >
        {title}
      </a>

      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-3">
        {summary}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 tracking-wide"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
