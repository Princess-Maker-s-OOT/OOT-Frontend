"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { UpdateClothesSchema } from "@/schemas/clothes"
import { updateClothes, getClothesById } from "@/lib/api/clothes"
import type { UpdateClothesRequest } from "@/schemas/clothes"

export default function ClothesEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const clothesId = Number(id)

  const [form, setForm] = useState<UpdateClothesRequest>({
    categoryId: 0,
    clothesSize: "M",
    clothesColor: "BLACK",
    description: "",
    images: [],
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clothesId) return

    getClothesById(clothesId).then((res) => {
      if (res.success) {
        const d = res.data
        setForm({
          categoryId: d.categoryId,
          clothesSize: d.clothesSize as UpdateClothesRequest["clothesSize"],
          clothesColor: d.clothesColor as UpdateClothesRequest["clothesColor"],
          description: d.description,
          images: d.clothesImages.map((img) => img.imageId),
        })
      } else {
        setError(res.message)
      }
    })
  }, [clothesId])

  const handleChange = (field: keyof UpdateClothesRequest, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const parseResult = UpdateClothesSchema.safeParse(form)
    if (!parseResult.success) {
      setError(parseResult.error.errors[0].message)
      setLoading(false)
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }

    const result = await updateClothes(clothesId, form, token)
    if (result.success) {
      router.push(`/clothes/${result.data.id}`)
    } else {
      setError(result.message || "수정 실패")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">옷 수정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">카테고리 ID</label>
          <input
            type="number"
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">사이즈</label>
          <select
            value={form.clothesSize}
            onChange={(e) => handleChange("clothesSize", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">색상</label>
          <select
            value={form.clothesColor}
            onChange={(e) => handleChange("clothesColor", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {["BLACK", "WHITE", "RED", "BLUE", "GREEN", "YELLOW", "GRAY", "PINK"].map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">이미지 ID 배열</label>
          <input
            type="text"
            placeholder="예: 1,2,3"
            value={form.images.join(",")}
            onChange={(e) =>
              handleChange(
                "images",
                e.target.value
                  .split(",")
                  .map((id) => parseInt(id.trim()))
                  .filter((id) => !isNaN(id))
              )
            }
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition"
        >
          {loading ? "수정 중..." : "수정하기"}
        </button>
      </form>
    </div>
  )
}