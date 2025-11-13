"use client"

import { useEffect, useState } from "react"
import { getRecommendations } from "@/lib/api/recommendation"
import type { RecommendationItem } from "@/lib/types/recommendation"

export default function RecommendationList() {
  const [items, setItems] = useState<RecommendationItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getRecommendations(token).then((res) => {
      if ("data" in res) setItems(res.data.content)
  else setError((res as any)?.message ?? "오류가 발생했습니다.")
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!items.length) return <div className="p-6 text-sm text-gray-500">추천 기록이 없습니다.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-sky-700 mb-4">추천 기록 목록</h1>
      {items.map((rec) => (
        <div key={rec.recommendationId} className="border rounded p-4 bg-white shadow-sm flex gap-4 items-center">
          <img src={rec.clothesImageUrl} alt="옷 이미지" className="w-20 h-20 object-cover rounded" />
          <div>
            <h2 className="text-lg font-semibold">{rec.clothesName}</h2>
            <p className="text-sm">추천 타입: {rec.type}</p>
            <p className="text-sm text-gray-600">추천 사유: {rec.reason}</p>
            <p className="text-xs text-gray-400">상태: {rec.status} | 생성일: {rec.createdAt}</p>
          </div>
        </div>
      ))}
    </div>
  )
}