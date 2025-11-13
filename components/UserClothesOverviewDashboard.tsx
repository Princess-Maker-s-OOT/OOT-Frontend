"use client"

import { useEffect, useState } from "react"
import { getUserClothesOverview } from "@/lib/api/dashboard"
import type { ClothesCategoryStat } from "@/lib/types/dashboard"

export default function UserClothesOverviewDashboard() {
  const [total, setTotal] = useState<number>(0)
  const [categories, setCategories] = useState<ClothesCategoryStat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getUserClothesOverview(token).then((res) => {
      if ("data" in res) {
        setTotal(res.data.totalClothes)
        setCategories(res.data.categoryStat)
      } else {
        setError(res.message)
      }
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

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
            <li key={cat.name} className="flex justify-between">
              <span>{cat.name}</span>
              <span className="font-medium">{cat.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}