"use client"

import { useEffect, useState } from "react"
import { getClosetById } from "@/lib/api/closet"
import type { ClosetDetailData } from "@/lib/types/closet"

interface Props {
  closetId: number
}

export default function ClosetDetail({ closetId }: Props) {
  const [closet, setCloset] = useState<ClosetDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getClosetById(closetId).then((res) => {
      if ("data" in res) setCloset(res.data)
      else setError((res as any)?.message ?? "오류가 발생했습니다.")
    })
  }, [closetId])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!closet) return <div className="p-6 text-sm text-gray-500">옷장 정보를 불러오는 중...</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-sky-700">{closet.name}</h1>
      <img src={closet.imageUrl} alt="옷장 이미지" className="w-full h-64 object-cover rounded mb-4" />
      <p className="text-sm text-gray-700 mb-2">{closet.description}</p>
      <div className="text-xs text-gray-500">
        공개 여부: {closet.isPublic ? "공개" : "비공개"}<br />
        생성일: {closet.createdAt}<br />
        수정일: {closet.updatedAt}
      </div>
    </div>
  )
}