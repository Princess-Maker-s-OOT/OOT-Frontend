"use client"

import { useEffect, useState } from "react"
import { getPopularCategoryStatistics } from "@/lib/api/admin"
import type { CategoryStat } from "@/lib/types/admin"

export default function PopularCategoryDashboard() {
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getPopularCategoryStatistics(token).then((res) => {
      if ("data" in res) setCategories(res.data.categoryStats)
      else setError(res.message)
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!categories.length) return <div className="p-6 text-sm text-gray-500">카테고리 통계가 없습니다.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">상위 카테고리 통계 (Top 10)</h1>
      <ul className="bg-white p-4 rounded shadow divide-y divide-gray-200">
        {categories.map((cat, index) => (
          <li key={cat.name} className="flex justify-between py-2 text-sm">
            <span className="font-medium">{index + 1}. {cat.name}</span>
            <span>{cat.count.toLocaleString()}건</span>
          </li>
        ))}
      </ul>
    </div>
  )
}