function relativeTime(isoString) {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function Header({ lastUpdated }) {
  return (
    <header className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#3b82f6] font-semibold text-sm tracking-wide uppercase">⚖</span>
          <h1 className="text-white font-semibold text-base sm:text-lg leading-tight">
            (My) Practice News
          </h1>
        </div>
        <span className="text-slate-500 text-xs">
          Updated {relativeTime(lastUpdated)}
        </span>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a]" />
    </header>
  )
}
