"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LinkClothesToClosetSchema } from "@/lib/validation"
import { linkClothesToCloset } from "@/lib/api/closet"
import { getClothes } from "@/lib/api/clothes"
import type { LinkClothesToClosetRequest } from "@/lib/validation"

interface Props {
  closetId: number
}

export default function LinkClothesForm({ closetId }: Props) {
  const router = useRouter()
  const [clothesId, setClothesId] = useState<number | null>(null)
  const [clothesList, setClothesList] = useState<any[]>([])
  const [clothesLoading, setClothesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchClothes() {
      setClothesLoading(true)
      try {
        const result = await getClothes({ page: 0, size: 50 })
        if (result.success && result.data) {
          setClothesList(result.data.content)
        }
      } catch (err) {
        // 에러 무시 (폼에서 안내)
      } finally {
        setClothesLoading(false)
      }
    }
    fetchClothes()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = LinkClothesToClosetSchema.safeParse({ clothesId })
    if (!parsed.success) {
      setError(parsed.error.errors.map((e) => e.message).join(", "))
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await linkClothesToCloset(closetId, parsed.data)
      if ("success" in result && result.success) {
        setSuccess("옷이 옷장에 등록되었습니다.")
        router.push(`/closets/${closetId}`)
      } else {
        setError(result.message || "등록 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold text-sky-700">옷장에 옷 등록</h1>

      <div>
        <label className="block text-sm font-medium mb-1">등록할 옷 선택</label>
        {clothesLoading ? (
          <div className="text-xs text-gray-500">옷 목록 불러오는 중...</div>
        ) : clothesList.length === 0 ? (
          <div className="text-xs text-gray-500">등록된 옷이 없습니다.</div>
        ) : (
          <select
            className="w-full border rounded px-3 py-2"
            value={clothesId ?? ""}
            onChange={(e) => setClothesId(Number(e.target.value))}
          >
            <option value="">옷 선택</option>
            {clothesList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.clothesImages?.[0]?.imageUrl ? "👕 " : ""}
                {c.description} / {c.clothesColor} / {c.clothesSize}
              </option>
            ))}
          </select>
        )}
        <p className="text-xs text-gray-500 mt-1">내 옷 목록에서 등록할 옷을 선택하세요.</p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "등록 중..." : "등록 완료"}
        </button>
      </div>
    </form>
  )
}