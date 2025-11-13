"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSalePostFromRecommendation } from "@/lib/api/sale-post"
import type { CreateSalePostFromRecommendationRequest } from "@/lib/validation"

export default function CreateSalePostFromRecommendationForm({ recommendationId }: { recommendationId: number }) {
  const router = useRouter()
  const [form, setForm] = useState<CreateSalePostFromRecommendationRequest>({
    title: "",
    content: "",
    price: 0,
    categoryId: 1,
    tradeAddress: "",
    tradeLatitude: "",
    tradeLongitude: "",
    imageUrls: []
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }

    try {
      const result = await createSalePostFromRecommendation(recommendationId, form, token)
      if (result.success) {
        router.push(`/sale-posts/${result.data.salePostId}`)
      } else {
        switch (result.code) {
          case "RECOMMENDATION_NOT_ACCEPTED":
            setError("추천이 수락되지 않았습니다.")
            break
          case "RECOMMENDATION_NOT_FOUND":
            setError("추천 정보를 찾을 수 없습니다.")
            break
          default:
            setError("판매글 등록 중 오류가 발생했습니다.")
        }
      }
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold text-sky-700">추천 기반 판매글 등록</h1>

      <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="제목" />
      <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="내용" />
      <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="가격" />
      <input value={form.tradeAddress} onChange={(e) => setForm({ ...form, tradeAddress: e.target.value })} placeholder="거래 주소" />
  <input value={form.tradeLatitude} onChange={(e) => setForm({ ...form, tradeLatitude: e.target.value })} placeholder="위도" />
  <input value={form.tradeLongitude} onChange={(e) => setForm({ ...form, tradeLongitude: e.target.value })} placeholder="경도" />
      <input value={form.imageUrls[0] || ""} onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })} placeholder="이미지 URL" />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={loading} className="bg-sky-600 text-white px-4 py-2 rounded">
        {loading ? "등록 중..." : "판매글 등록"}
      </button>
    </form>
  )
}