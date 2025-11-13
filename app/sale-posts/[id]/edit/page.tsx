"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import CategorySelector from "@/components/CategorySelector"
import { getMockCategories } from "@/lib/mockData"
import { UpdateSalePostSchema } from "@/lib/validation"
import type { UpdateSalePostRequest } from "@/lib/types"

type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

export default function EditSalePostPage() {
  const { id } = useParams()
  const salePostId = Array.isArray(id) ? id[0] : id
  const router = useRouter()

  const [form, setForm] = useState<UpdateSalePostRequest>({
    title: "",
    content: "",
    price: 0,
    categoryId: 1,
    tradeAddress: "",
    tradeLatitude: "",
    tradeLongitude: "",
    imageUrls: [],
  })
  const [imageInput, setImageInput] = useState("")
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // 카테고리 로딩
  useEffect(() => {
    const mock = getMockCategories()
    setCategories(mock)
    setLoadingCategories(false)
  }, [])

  // 판매글 데이터 불러오기
  useEffect(() => {
    if (!salePostId) return
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/sale-posts/${salePostId}`)
        const json = await res.json()
        if (res.ok && json.data) {
          const d = json.data
          setForm({
            title: d.title,
            content: d.content,
            price: d.price,
            categoryId: d.categoryId ?? 1,
            tradeAddress: d.tradeAddress,
            tradeLatitude: String(d.tradeLatitude ?? ""),
            tradeLongitude: String(d.tradeLongitude ?? ""),
            imageUrls: d.imageUrls ?? [],
          })
        } else {
          setError("판매글 데이터를 불러올 수 없습니다.")
        }
      } catch {
        setError("네트워크 오류가 발생했습니다.")
      }
    }
    fetchData()
  }, [salePostId])

  // 수정 요청
  async function updateSalePost(id: string, data: UpdateSalePostRequest) {
    const response = await fetch(`/api/v1/sale-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return await response.json()
  }

  // 삭제 요청
  async function deleteSalePost(id: string) {
    const confirmed = window.confirm("정말 삭제하시겠습니까?")
    if (!confirmed) return
    try {
      const res = await fetch(`/api/v1/sale-posts/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/sale-posts/my")
      } else {
        setError("삭제에 실패했습니다.")
      }
    } catch {
      setError("삭제 중 오류가 발생했습니다.")
    }
  }

  // 이미지 추가
  function addImage() {
    if (!imageInput) return
    setForm((s) => ({ ...s, imageUrls: [...s.imageUrls, imageInput] }))
    setImageInput("")
  }

  // 제출 핸들러
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = UpdateSalePostSchema.safeParse({
      ...form,
      price: Number(form.price),
    })

    if (!parsed.success) {
      setError(parsed.error.errors.map((i) => i.message).join(", "))
      return
    }

    setLoading(true)
    try {
      const result = await updateSalePost(salePostId!, parsed.data)
      if (result.success) {
        router.push(`/sale-posts/${salePostId}`)
      } else {
        setError(result.message || "수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* 상단 안내 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-sky-600">판매글 수정</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          기존 판매글을 수정하거나 삭제할 수 있습니다.<br />
          정보가 정확할수록 거래 성공률이 높아집니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-medium mb-1">가격</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
          {loadingCategories ? (
            <p className="text-sm text-gray-400">카테고리를 불러오는 중...</p>
          ) : (
            <CategorySelector
              categories={categories}
              onSelect={(id) => setForm({ ...form, categoryId: id })}
            />
          )}
        </div>

        {/* 거래 위치 */}
        <div>
          <label className="block text-sm font-medium mb-1">거래 위치</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.tradeAddress}
            onChange={(e) => setForm({ ...form, tradeAddress: e.target.value })}
          />
        </div>

        {/* 좌표 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Latitude</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.tradeLatitude}
              onChange={(e) => setForm({ ...form, tradeLatitude: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Longitude</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={form.tradeLongitude}
              onChange={(e) => setForm({ ...form, tradeLongitude: e.target.value })}
            />
          </div>
        </div>

        {/* 이미지 */}
        <div>
          <label className="block text-sm font-medium mb-1">이미지 URL</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <button type="button" onClick={addImage} className="px-3 py-2 bg-gray-100 rounded">추가</button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.imageUrls.map((u, i) => (
              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{u}</span>
            ))}
          </div>
        </div>
        {/* 메시지 */}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        {/* 버튼 */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => deleteSalePost(salePostId!)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
          >
            삭제하기
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-100 text-sky-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  )
}