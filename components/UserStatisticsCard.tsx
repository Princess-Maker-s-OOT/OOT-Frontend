interface Props {
  title: string
  value: number
  color?: string
}

export default function UserStatisticsCard({ title, value, color = "sky" }: Props) {
  return (
    <div className={`bg-${color}-100 border-l-4 border-${color}-500 p-4 rounded shadow-sm`}>
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-${color}-700 mt-1">{value.toLocaleString()}</p>
    </div>
  )
}