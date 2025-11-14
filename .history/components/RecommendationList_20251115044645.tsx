"use client"

import { useEffect, useState } from "react"
import { getMyRecommendations } from "@/lib/api/recommendation"
import type { RecommendationGetMyResponse } from "@/lib/types/recommendation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, ThumbsUp, ThumbsDown, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"

export default function RecommendationList() {
  const [items, setItems] = useState<RecommendationGetMyResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchRecommendations = async (pageNum: number) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getMyRecommendations(pageNum, 10)

      if (result.success) {
        setItems(result.data.content)
        setTotalPages(result.data.totalPages)
        setPage(pageNum)
      } else {
        setError(result.error || "추천 목록을 불러오는데 실패했습니다.")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations(0)
  }, [])

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-sky-700" />
      </div>
    )
  }

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-gray-500">추천 기록이 없습니다.</p>
            <p className="text-xs text-gray-400 mt-2">
              1년 이상 착용하지 않은 옷이 있으면 자동으로 추천이 생성됩니다.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sky-700">추천 목록</h1>
        <Link href="/recommendations/new">
          <Button>추천 수동 생성</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {items.map((rec) => (
          <Card key={rec.recommendationId}>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {rec.clothesImageUrl && (
                  <img
                    src={rec.clothesImageUrl}
                    alt={rec.clothesName}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {rec.type === "SALE" ? (
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                    ) : (
                      <Heart className="w-5 h-5 text-pink-600" />
                    )}
                    <h2 className="text-lg font-semibold">{rec.clothesName}</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">추천 타입:</span>{" "}
                    {rec.type === "SALE" ? "판매" : "기부"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">추천 사유:</span> {rec.reason}
                  </p>
                  <p className="text-xs text-gray-400">
                    상태: {rec.status === "PENDING" && "대기 중"}
                    {rec.status === "ACCEPTED" && "수락됨"}
                    {rec.status === "REJECTED" && "거절됨"} | 생성일:{" "}
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </p>

                  {rec.status === "PENDING" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="text-green-600">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        수락
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        거절
                      </Button>
                    </div>
                  )}

                  {rec.status === "ACCEPTED" && rec.type === "SALE" && (
                    <Link href={`/recommendations/${rec.recommendationId}/sale-post`}>
                      <Button size="sm" className="mt-3">
                        판매글 작성
                      </Button>
                    </Link>
                  )}

                  {rec.status === "ACCEPTED" && rec.type === "DONATION" && (
                    <Button size="sm" className="mt-3">
                      주변 기부처 찾기
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => fetchRecommendations(page - 1)}
            disabled={page === 0 || loading}
            variant="outline"
          >
            이전
          </Button>
          <span className="flex items-center px-4">
            {page + 1} / {totalPages}
          </span>
          <Button
            onClick={() => fetchRecommendations(page + 1)}
            disabled={page >= totalPages - 1 || loading}
            variant="outline"
          >
            다음
          </Button>
        </div>
      )}
    </div>
  )
}