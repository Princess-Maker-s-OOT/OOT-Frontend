"use client"

import { useEffect, useState } from "react"
import { getUserWearStatistics } from "@/lib/api/dashboard"
import type { ClothesWearCount, NotWornOverPeriod } from "@/lib/types/dashboard"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function UserWearStatisticsDashboard() {
  const [wornThisWeek, setWornThisWeek] = useState<ClothesWearCount[]>([])
  const [topWorn, setTopWorn] = useState<ClothesWearCount[]>([])
  const [leastWorn, setLeastWorn] = useState<ClothesWearCount[]>([])
  const [notWorn, setNotWorn] = useState<NotWornOverPeriod[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [baseDate, setBaseDate] = useState<string>("")

  const fetchData = async (date?: string) => {
    setLoading(true)
    setError(null)
    
    const result = await getUserWearStatistics(date)
    
    if (result.success) {
      setWornThisWeek(result.data.wornThisWeek)
      setTopWorn(result.data.topWornClothes)
      setLeastWorn(result.data.leastWornClothes)
      setNotWorn(result.data.notWornOverPeriod)
    } else {
      setError(result.error || "데이터를 불러오는 중 오류가 발생했습니다.")
    }
    
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseDate(e.target.value)
  }

  const handleApplyDate = () => {
    fetchData(baseDate || undefined)
  }

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-700">착용 통계 대시보드</h1>
        
        <div className="flex items-end gap-2">
          <div>
            <Label htmlFor="baseDate" className="text-sm">기준 날짜</Label>
            <Input
              id="baseDate"
              type="date"
              value={baseDate}
              onChange={handleDateChange}
              className="w-[180px]"
            />
          </div>
          <Button onClick={handleApplyDate} disabled={loading} size="sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            조회
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-sky-700" />
        </div>
      ) : (
        <>
          <StatSection title="이번 주 착용한 옷" items={wornThisWeek} />
          <StatSection title="최다 착용 옷" items={topWorn} />
          <StatSection title="최소 착용 옷" items={leastWorn} />
          <NotWornSection title="최근 미착용 옷" items={notWorn} />
        </>
      )}
    </div>
  )
}

function StatSection({ title, items }: { title: string; items: ClothesWearCount[] }) {
  if (!items.length) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.clothesId} className="flex justify-between">
            <span>{item.clothesName}</span>
            <span className="font-medium">{item.wearCount}회</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotWornSection({ title, items }: { title: string; items: NotWornOverPeriod[] }) {
  if (!items.length) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.clothesId} className="flex justify-between">
            <span>{item.clothesName}</span>
            <span className="text-gray-600">{item.daysSinceLastWorn}일 미착용</span>
          </li>
        ))}
      </ul>
    </div>
  )
}