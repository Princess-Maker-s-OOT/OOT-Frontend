"use client"

import { useEffect, useState } from "react"
import { getUserDashboardSummary } from "@/lib/api/dashboard"
import type { CategoryStat } from "@/lib/types/dashboard"
import { Loader2 } from "lucide-react"

export default function UserClothesOverviewDashboard() {
  const [total, setTotal] = useState<number>(0)
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getUserDashboardSummary()
      
      if (result.success) {
        setTotal(result.data?.totalClothes ?? 0)
        setCategories(result.data?.categoryStat ?? [])
      } else {
        setError(result.error || "데이터를 불러오는 중 오류가 발생했습니다.")
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-700" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">내 옷 분포 현황</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">전체 옷 수</h2>
        <p className="text-2xl font-bold text-sky-700">{total.toLocaleString()}벌</p>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-md font-semibold mb-2">카테고리별 분포</h3>
        <ul className="space-y-1 text-sm">
          {categories.map((cat) => (
            <li key={cat.categoryName} className="flex justify-between">
              <span>{cat.categoryName}</span>
              <span className="font-medium">{cat.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}