"use client"

import { useEffect, useState } from "react"
import { getMyClosets } from "@/lib/api/closet"
import type { ClosetItem } from "@/lib/types/closet"
import Link from "next/link"

export default function MyClosetList() {
  const [closets, setClosets] = useState<ClosetItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getMyClosets(token).then((res) => {
      if ("data" in res) setClosets(res.data.content)
  else setError((res as any)?.message ?? "오류가 발생했습니다.")
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!closets.length) return <div className="p-6 text-sm text-gray-500">등록된 옷장이 없습니다.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-sky-700 mb-4">내 옷장 목록</h1>
      {closets.map((closet) => (
        <Link
          key={closet.closetId}
          href={`/closets/${closet.closetId}`}
          className="block border rounded p-4 hover:bg-gray-50"
        >
          <div className="flex gap-4 items-center">
            <img src={closet.imageUrl} alt="옷장 이미지" className="w-20 h-20 object-cover rounded" />
            <div>
              <h2 className="text-lg font-semibold">{closet.name}</h2>
              <p className="text-sm text-gray-600">{closet.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                공개 여부: {closet.isPublic ? "공개" : "비공개"} | 생성일: {closet.createdAt}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}