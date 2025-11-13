"use client"

import { useEffect, useState } from "react"
import { getClothesStatistics } from "@/lib/api/admin"
import type {
  ClothesCategoryStat,
  ClothesColorStat,
  ClothesSizeStat,
} from "@/lib/types/admin"

export default function ClothesStatisticsDashboard() {
  const [total, setTotal] = useState<number>(0)
  const [categories, setCategories] = useState<ClothesCategoryStat[]>([])
  const [colors, setColors] = useState<ClothesColorStat[]>([])
  const [sizes, setSizes] = useState<ClothesSizeStat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getClothesStatistics(token).then((res) => {
      if ("data" in res) {
        setTotal(res.data.totalClothes)
        setCategories(res.data.categoryStats)
        setColors(res.data.colorStats)
        setSizes(res.data.sizeStats)
      } else {
        setError(res.message)
      }
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">옷 통계 대시보드</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">전체 옷 수</h2>
        <p className="text-2xl font-bold text-sky-700">{total.toLocaleString()}벌</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatSection title="카테고리별 통계" items={categories.map((c) => [c.name, c.count])} />
        <StatSection title="색상별 통계" items={colors.map((c) => [c.clothesColor, c.count])} />
        <StatSection title="사이즈별 통계" items={sizes.map((s) => [s.clothesSize, s.count])} />
      </div>
    </div>
  )
}

function StatSection({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <ul className="space-y-1 text-sm">
        {items.map(([label, count]) => (
          <li key={label} className="flex justify-between">
            <span>{label}</span>
            <span className="font-medium">{count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}