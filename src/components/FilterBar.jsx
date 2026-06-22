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

function Filter({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap text-[12.5px] pb-0.5 border-b transition-colors ${
        active
          ? 'text-[#F4F3EF] font-medium border-[#F4F3EF]'
          : 'text-[#8B8B89] hover:text-[#C9C8C4] border-transparent'
      }`}
    >
      {label}
    </button>
  )
}

export default function FilterBar({ region, tag, onRegion, onTag }) {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-5">
      <div className="flex flex-wrap gap-x-5 gap-y-2 mb-3">
        {REGIONS.map(r => (
          <Filter key={r} label={r} active={region === r} onClick={() => onRegion(r)} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {TAGS.map(t => (
          <Filter key={t} label={t} active={tag === t} onClick={() => onTag(t)} />
        ))}
      </div>
    </div>
  )
}
