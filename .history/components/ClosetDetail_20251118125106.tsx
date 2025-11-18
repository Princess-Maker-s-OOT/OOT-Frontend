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
    <div className="min-h-screen bg-repeat bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] bg-gray-100 py-10">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-3xl shadow-xl border-2 border-sky-200 relative">
        {/* 인테리어 타이틀 & 아이콘 */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🛋️</span>
          <h1 className="text-2xl font-bold text-sky-600 drop-shadow">나만의 방 옷장</h1>
        </div>
        {/* 옷장 이미지 + 선반/옷걸이 SVG */}
        <div className="relative mb-6 flex flex-col items-center">
          <div className="w-full flex justify-center mb-[-16px]">
            <svg width="180" height="32" viewBox="0 0 180 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="16" width="180" height="8" rx="4" fill="#e0e7ef" />
              <rect x="40" y="0" width="100" height="8" rx="4" fill="#b4c8e7" />
              <circle cx="20" cy="20" r="4" fill="#b4c8e7" />
              <circle cx="160" cy="20" r="4" fill="#b4c8e7" />
            </svg>
          </div>
          <img src={closet.imageUrl} alt="옷장 이미지" className="w-full h-56 object-cover rounded-2xl border-2 border-sky-200 shadow-lg" />
        </div>
        <p className="text-base text-gray-700 mb-2 text-center font-semibold">{closet.description}</p>
        <div className="text-xs text-gray-400 text-center mb-2">
          공개 여부: <span className="font-bold text-sky-600">{closet.isPublic ? "공개" : "비공개"}</span>
        </div>
        {isMine && (
          <div className="mt-2 flex justify-center">
            <button
              className="bg-gradient-to-r from-yellow-400 to-sky-400 text-white px-8 py-2 rounded-2xl hover:from-yellow-500 hover:to-sky-500 font-bold shadow-xl text-lg transition border-2 border-yellow-300"
              onClick={() => window.location.href = `/closets/${closet.closetId}/link-clothes`}
            >
              🚪 옷장 문 열기
            </button>
          </div>
        )}
        <div className="mt-10">
          {/* 옷장에 등록된 옷 리스트 표시 (선반 위에 놓인 듯) */}
          <div className="relative">
            <div className="absolute left-0 right-0 top-0 h-4 bg-yellow-200 rounded-b-2xl opacity-60 z-0" />
            <ClosetClothesList closetId={closet.closetId} isMine={isMine} />
          </div>
        </div>
        {/* 하단 러그/쿠션 SVG */}
        <div className="flex justify-center mt-10">
          <svg width="120" height="32" viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="60" cy="16" rx="55" ry="12" fill="#ffe4e1" />
            <ellipse cx="60" cy="16" rx="35" ry="7" fill="#f7cac9" />
          </svg>
        </div>
        {/* 빈 공간 안내 메시지 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          {isMine && (
            <span>🧦 옷을 추가해서 나만의 방 옷장을 꾸며보세요!</span>
          )}
        </div>
      </div>
    </div>
  )
}