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
  const [selectedIds, setSelectedIds] = useState<number[]>([])
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

    if (selectedIds.length === 0) {
      setError("등록할 옷을 선택하세요.")
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      // 여러 옷 등록 지원 (순차 등록)
      for (const clothesId of selectedIds) {
        const parsed = LinkClothesToClosetSchema.safeParse({ clothesId })
        if (!parsed.success) continue
        await linkClothesToCloset(closetId, parsed.data)
      }
      setSuccess("옷이 옷장에 등록되었습니다.")
      router.push(`/closets/${closetId}`)
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center">
      <div className="w-full flex items-center justify-center" style={{ minHeight: '80vh' }}>
        <form onSubmit={handleSubmit} className="space-y-10 bg-white p-12 rounded-3xl shadow-2xl border-2 border-pink-200 max-w-2xl w-full relative">
        {/* 상단 타이틀 */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-pink-500 drop-shadow">옷장에 옷 등록</h1>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-4 text-sky-700">등록할 옷 선택</label>
          {clothesLoading ? (
            <div className="text-xs text-gray-500">옷 목록 불러오는 중...</div>
          ) : clothesList.length === 0 ? (
            <div className="text-xs text-gray-500">등록된 옷이 없습니다.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              {clothesList.map((c) => {
                const imageUrl = c.clothesImages?.find((img: any) => img.isMain)?.imageUrl || c.clothesImages?.[0]?.imageUrl
                const checked = selectedIds.includes(c.id)
                return (
                  <label key={c.id} className={`relative flex flex-col items-center justify-between border-2 border-pink-200 rounded-2xl bg-sky-50 shadow-lg p-6 aspect-square min-h-[220px] cursor-pointer transition ${checked ? 'ring-4 ring-pink-400' : ''}`}>
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 w-5 h-5 accent-pink-400"
                      checked={checked}
                      onChange={() => {
                        setSelectedIds((prev) => checked ? prev.filter(id => id !== c.id) : [...prev, c.id])
                      }}
                    />
                    {imageUrl ? (
                      <img src={imageUrl} alt="옷 이미지" className="w-28 h-28 object-cover rounded-xl mb-3" />
                    ) : (
                      <div className="w-28 h-28 bg-gray-100 flex items-center justify-center rounded-xl text-gray-400 text-sm mb-3">이미지 없음</div>
                    )}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="text-lg font-bold mb-2 truncate max-w-[120px]">{c.description}</div>
                      <div className="text-sm text-gray-600">{c.clothesColor} / {c.clothesSize}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">이미지와 정보를 보고 옷을 선택하세요.</p>
        </div>

        {error && <div className="text-base text-red-600 text-center font-semibold">{error}</div>}
        {success && <div className="text-base text-green-600 text-center font-semibold">{success}</div>}

        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-pink-400 to-sky-400 text-white px-12 py-4 rounded-full hover:from-pink-500 hover:to-sky-500 font-bold shadow-xl text-xl transition"
          >
            {loading ? "등록 중..." : "등록 완료"}
          </button>
        </div>
      </form>
    </div>
  )
}