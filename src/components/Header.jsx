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

export default function Header({ lastUpdated }) {
  return (
    <header className="sticky top-0 z-20 bg-[#0f1117]/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-white font-semibold text-xl sm:text-2xl tracking-tight leading-none">
            My Practice
          </h1>
          <p className="text-slate-500 text-[10px] tracking-widest uppercase mt-1 font-light">
            Legal Intelligence
          </p>
        </div>
        <span className="text-slate-500 text-xs">
          Updated {relativeTime(lastUpdated)}
        </span>
      </div>
      <div className="h-px bg-slate-700" />
    </header>
  )
}
