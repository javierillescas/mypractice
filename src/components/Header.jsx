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

const SECTION_LABELS = [
  { id: 'news', label: 'News' },
  { id: 'blog', label: 'Blog', soon: true },
  { id: 'bio', label: 'Bio' },
]

export default function Header({ lastUpdated, section, onSection }) {
  return (
    <header className="max-w-4xl mx-auto px-5 sm:px-8 pt-9">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#8E8E8B] mb-2">
            Legal Intelligence
          </p>
          <h1 className="font-serif text-[34px] sm:text-[40px] font-semibold text-[#F8F7F2] leading-none tracking-tight">
            (My) Practice
          </h1>
          <p className="font-serif text-[13.5px] text-[#9A9A96] mt-2.5 tracking-wide">
            Curated by Javier Illescas
          </p>
        </div>
        <span className="text-[#76766F] text-xs pt-2 whitespace-nowrap">
          Updated {relativeTime(lastUpdated)}
        </span>
      </div>

      <nav className="flex gap-7 sm:gap-8 border-b border-[#2A2B2F] mt-6">
        {SECTION_LABELS.map(({ id, label, soon }) => {
          const active = section === id
          return (
            <button
              key={id}
              onClick={() => onSection(id)}
              className={`-mb-px pb-3 text-[14.5px] flex items-center gap-2 border-b-2 transition-colors ${
                active
                  ? 'text-[#3FA06E] font-medium border-[#3FA06E]'
                  : 'text-[#76766F] hover:text-[#C9C8C4] border-transparent'
              }`}
            >
              {label}
              {soon && (
                <span className="text-[11px] tracking-wider text-[#5E5E5C] border border-[#2F3034] rounded px-1.5">
                  Soon
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
