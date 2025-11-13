"use client"

import { useEffect, useState } from "react"
import { getClothes } from "@/lib/api/clothes"
import type { ClothesItem } from "@/types/clothes"

export default function ClothesListPage() {
  const [items, setItems] = useState<ClothesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }

    getClothes({ size: 12 }, token)
      .then((res) => {
        if (res.success) {
          setItems(res.data.content)
        } else {
          setError(res.message || "조회 실패")
        }
      })
      .catch(() => {
        setError("서버 오류")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-6">옷 목록 불러오는 중...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">옷 리스트</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded shadow-sm p-3 hover:shadow-md transition">
            <img
              src={item.clothesImages.find((img) => img.isMain)?.imageUrl ?? "/placeholder.jpg"}
              alt={item.description}
              className="h-40 w-full object-cover rounded mb-2 bg-gray-100"
            />
            <div className="text-sm font-semibold truncate">{item.description}</div>
            <div className="text-xs text-gray-500 mt-1">
              {item.clothesColor} / {item.clothesSize}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}