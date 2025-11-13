"use client"

import { useEffect, useState } from "react"
import { getWearStatistics } from "@/lib/api/dashboard"
import type { WornClothesStat, NotWornClothesStat } from "@/lib/types/dashboard"

export default function UserWearStatisticsDashboard() {
  const [wornThisWeek, setWornThisWeek] = useState<WornClothesStat[]>([])
  const [topWorn, setTopWorn] = useState<WornClothesStat[]>([])
  const [leastWorn, setLeastWorn] = useState<WornClothesStat[]>([])
  const [notWorn, setNotWorn] = useState<NotWornClothesStat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getWearStatistics(token).then((res) => {
      if ("data" in res) {
        setWornThisWeek(res.data.wornThisWeek)
        setTopWorn(res.data.topWornClothes)
        setLeastWorn(res.data.leastWornClothes)
        setNotWorn(res.data.notWornOverPeriod)
      } else {
        setError(res.message)
      }
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">착용 통계 대시보드</h1>

      <StatSection title="이번 주 착용한 옷" items={wornThisWeek} />
      <StatSection title="최다 착용 옷" items={topWorn} />
      <StatSection title="최소 착용 옷" items={leastWorn} />
      <NotWornSection title="최근 미착용 옷" items={notWorn} />
    </div>
  )
}

function StatSection({ title, items }: { title: string; items: WornClothesStat[] }) {
  if (!items.length) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.clothesId} className="flex justify-between">
            <span>{item.clothesDescription}</span>
            <span className="font-medium">{item.wearCount}회</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function NotWornSection({ title, items }: { title: string; items: NotWornClothesStat[] }) {
  if (!items.length) return null
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <ul className="space-y-1 text-sm">
        {items.map((item) => (
          <li key={item.clothesId} className="flex justify-between">
            <span>{item.clothesDescription}</span>
            <span className="text-gray-600">{item.daysNotWorn}일 미착용</span>
          </li>
        ))}
      </ul>
    </div>
  )
}