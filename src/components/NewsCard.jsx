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
  const { title, url, source, region, date, summary, tags } = article
  return (
    <article className="bg-[#161719] border border-[#26272B] rounded-lg p-[18px] transition-colors hover:border-[#3A3B40]">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#E8E7E3]">{source}</span>
          <span className="text-[11px] tracking-wide text-[#8B8B89] border border-[#34353A] rounded px-1.5 py-px">
            {region}
          </span>
        </div>
        <span className="text-[11px] text-[#6E6E6C]">{relativeTime(date)}</span>
      </div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block font-serif text-[16px] font-medium text-[#F1F0EC] leading-snug mb-2 hover:text-[#C9C8C4] transition-colors"
      >
        {title}
      </a>

      {summary && (
        <p className="text-[12.5px] text-[#9C9B97] leading-relaxed line-clamp-2 mb-3">
          {summary}
        </p>
      )}

      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E8E7E3] flex-shrink-0" />
        <span className="text-[11px] text-[#8B8B89]">{tags.join(' · ')}</span>
      </div>
    </article>
  )
}
