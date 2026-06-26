interface Props {
  title: string
  value: string | number
  subtitle?: string
  color?: 'gold' | 'green' | 'blue' | 'default'
}

const colors = {
  gold: 'text-[#C9A84C]',
  green: 'text-green-400',
  blue: 'text-blue-400',
  default: 'text-white',
}

export default function StatsCard({ title, value, subtitle, color = 'default' }: Props) {
  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-6">
      <p className="text-[#6b7280] text-xs uppercase tracking-wider mb-2">{title}</p>
      <p className={`text-3xl font-bold ${colors[color]}`}>{value}</p>
      {subtitle && <p className="text-[#6b7280] text-xs mt-1">{subtitle}</p>}
    </div>
  )
}
