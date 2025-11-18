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
          const { getMyClosets } = await import("@/lib/api/closet")
          const myClosetsRes = await getMyClosets()
          if (myClosetsRes.success && myClosetsRes.data) {
            const isMine = myClosetsRes.data.content.some((c) => c.closetId === closetId)
            setIsMine(isMine)
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
    <div className="min-h-screen bg-sky-100 py-10">
      <div className="max-w-[800px] mx-auto p-6 bg-white rounded-3xl shadow-lg border-2 border-pink-200 relative">
        {/* 타이틀만 (곰돌이 제거) */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-pink-500 drop-shadow">디지털 옷장</h1>
        </div>
        {/* 옷장 이미지 */}
        <div className="relative mb-4">
          <img src={closet.imageUrl} alt="옷장 이미지" className="w-full h-56 object-cover rounded-2xl border-2 border-sky-200 shadow" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-2 bg-yellow-200 rounded-full opacity-60" />
        </div>
        <p className="text-base text-gray-700 mb-2 text-center font-semibold">{closet.description}</p>
        <div className="text-xs text-gray-400 text-center mb-2">
          공개 여부: <span className="font-bold text-sky-500">{closet.isPublic ? "공개" : "비공개"}</span>
        </div>
        {isMine && (
          <button
            className="absolute top-6 right-6 bg-gradient-to-r from-pink-400 to-sky-400 text-white px-5 py-2 rounded-full hover:from-pink-500 hover:to-sky-500 font-bold shadow-lg text-lg transition z-10"
            onClick={() => window.location.href = `/closets/${closet.closetId}/link-clothes`}
          >
            + 옷 등록
          </button>
        )}
        <div className="mt-8">
          <ClosetClothesList closetId={closet.closetId} isMine={isMine} />
        </div>
        {/* 빈 공간 안내 메시지 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          {isMine && (
            <span>👗 옷을 추가해서 나만의 디지털 옷장을 완성해보세요!</span>
          )}
        </div>
      </div>
    </div>
  )
}