"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Recommendation } from "@/lib/types/recommendation"

export default function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-lg font-bold">{recommendation.reason}</h2>
      <p className="text-sm text-gray-500">상태: {recommendation.status}</p>

      {recommendation.status === "ACCEPTED" ? (
        <Link href={`/recommendations/${recommendation.recommendationId}/sale-post`}>
          <Button className="mt-2">판매글 등록</Button>
        </Link>
      ) : (
        <p className="text-sm text-gray-500 mt-2">추천이 수락된 경우에만 등록할 수 있습니다.</p>
      )}
    </div>
  )
}