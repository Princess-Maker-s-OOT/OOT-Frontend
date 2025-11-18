"use client"

import { useEffect, useState } from "react"
import ClosetClothesList from "./ClosetClothesList"
import { getClosetById } from "@/lib/api/closet"
import type { ClosetDetailData } from "@/lib/types/closet"

interface Props {
  closetId: number
}

export default function ClosetDetail({ closetId }: Props) {
  const [closet, setCloset] = useState<ClosetDetailData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMine, setIsMine] = useState(false)

  useEffect(() => {
    if (typeof closetId === "number" && !isNaN(closetId)) {
      getClosetById(closetId).then(async (res) => {
        if ("data" in res) {
          setCloset(res.data)
          // 본인 옷장 여부 확인
          const userRes = await import("@/lib/api/user")
          const getMyInfo = userRes.getMyInfo
          const userResult = await getMyInfo()
          if (userResult.success && userResult.data) {
            // ownerId와 userId 비교
            setIsMine(res.data.ownerId === userResult.data.userId)
          }
        } else setError((res as any)?.message ?? "오류가 발생했습니다.")
      })
    } else {
      setError("옷장 ID가 올바르지 않습니다.")
    }
  }, [closetId])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!closet) return <div className="p-6 text-sm text-gray-500">옷장 정보를 불러오는 중...</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-sky-700">{closet.name}</h1>
      <img src={closet.imageUrl} alt="옷장 이미지" className="w-full h-64 object-cover rounded mb-4" />
      <p className="text-sm text-gray-700 mb-2">{closet.description}</p>
      <div className="text-xs text-gray-500">
        공개 여부: {closet.isPublic ? "공개" : "비공개"}
      </div>
      {isMine && (
        <div className="mt-4 flex justify-end">
          <button
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 transition font-semibold shadow"
            onClick={() => window.location.href = `/closets/${closet.closetId}/link-clothes`}
          >
            옷 등록
          </button>
        </div>
      )}
      <div className="mt-8">
        {/* 옷장에 등록된 옷 리스트 표시 */}
        <ClosetClothesList closetId={closet.closetId} isMine={isMine} />
      </div>
    </div>
  )
}