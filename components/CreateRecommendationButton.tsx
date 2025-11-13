"use client"

import { useState } from "react"
import { createRecommendation } from "@/lib/api/recommendation"
import type { RecommendationItem } from "@/lib/types/recommendation"

export default function CreateRecommendationButton() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setError(null)
    setRecommendations([])
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await createRecommendation(token)
      if ("data" in result) {
        setRecommendations(result.data)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4 bg-white rounded shadow">
      <h1 className="text-xl font-bold text-sky-700">추천 기록 생성</h1>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
      >
        {loading ? "추천 생성 중..." : "추천 생성하기"}
      </button>

      {error && <div className="text-sm text-red-600">{error}</div>}

      {recommendations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold mt-4">추천 결과</h2>
          {recommendations.map((rec) => (
            <div key={rec.recommendationId} className="border rounded p-4 bg-gray-50">
              <div className="text-sm font-semibold">옷 ID: {rec.clothesId}</div>
              <div className="text-sm">추천 타입: {rec.type}</div>
              <div className="text-sm">추천 사유: {rec.reason}</div>
              <div className="text-sm text-gray-500">상태: {rec.status}</div>
              <div className="text-xs text-gray-400 mt-1">생성일: {rec.createdAt}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}