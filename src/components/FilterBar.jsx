const REGIONS = ['All', 'US', 'UK', 'EU', 'Global']
const TAGS = [
  'All',
  'AI in Law',
  'Regulation',
  'In-House Counsel',
  'Legal Market',
  'Legal Education',
  'Legal Tech',
  'Legal Reasoning',
]

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-all
        ${active
          ? 'bg-white border-white text-slate-900 font-medium'
          : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-400 hover:text-slate-200'
        }
      `}
    >
      {label}
    </button>
  )
}

export default function FilterBar({ region, tag, onRegion, onTag }) {
  return (
    <div className="sticky top-[57px] z-10 bg-[#0f1117]/95 backdrop-blur-sm border-b border-slate-800 py-2.5">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {REGIONS.map(r => (
            <Pill key={r} label={r} active={region === r} onClick={() => onRegion(r)} />
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TAGS.map(t => (
            <Pill key={t} label={t} active={tag === t} onClick={() => onTag(t)} />
          ))}
        </div>
      </div>
    </div>
  )
}
