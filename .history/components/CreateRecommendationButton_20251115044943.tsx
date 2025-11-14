"use client"

import { useState } from "react"
import { generateRecommendations } from "@/lib/api/recommendation"
import type { RecommendationCreateResponse } from "@/lib/types/recommendation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ShoppingCart, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreateRecommendationButton() {
  const [recommendations, setRecommendations] = useState<RecommendationCreateResponse[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    setError(null)
    setRecommendations([])
    setLoading(true)

    try {
      const result = await generateRecommendations()
      
      if (result.success) {
        setRecommendations(result.data)
        
        if (result.data.length === 0) {
          setError("1년 이상 착용하지 않은 옷이 없어 추천을 생성하지 않았습니다.")
        }
      } else {
        setError(result.error || "추천 생성에 실패했습니다.")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-sky-700">추천 수동 생성</CardTitle>
          <CardDescription>
            1년 이상 착용하지 않은 옷에 대해 판매 또는 기부 추천을 즉시 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleCreate}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                추천 생성 중...
              </>
            ) : (
              "추천 생성하기"
            )}
          </Button>

          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">추천 생성 완료</h2>
                <p className="text-sm text-gray-600">총 {recommendations.length}개</p>
              </div>
              
              <div className="space-y-2">
                {recommendations.map((rec) => (
                  <Card key={rec.recommendationId}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        {rec.type === "SALE" ? (
                          <ShoppingCart className="w-5 h-5 text-green-600 mt-0.5" />
                        ) : (
                          <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-semibold">
                            옷 ID: {rec.clothesId}
                          </div>
                          <div className="text-sm text-gray-600">
                            추천 타입: {rec.type === "SALE" ? "판매" : "기부"}
                          </div>
                          <div className="text-sm text-gray-600">
                            추천 사유: {rec.reason}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            상태: {rec.status} | 생성일:{" "}
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={() => router.push("/recommendations")}
                variant="outline"
                className="w-full"
              >
                추천 목록으로 이동
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}