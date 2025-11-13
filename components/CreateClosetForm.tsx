"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateClosetSchema } from "@/lib/validation"
import { createCloset } from "@/lib/api/closet"
import type { CreateClosetRequest } from "@/lib/validation"

export default function CreateClosetForm() {
  const router = useRouter()
  const [form, setForm] = useState<CreateClosetRequest>({
    name: "",
    description: "",
    imageId: 0,
    isPublic: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = CreateClosetSchema.safeParse(form)
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
      const result = await createCloset(parsed.data, token)
      if ("success" in result && result.success) {
        setSuccess("옷장이 등록되었습니다.")
        router.push("/closets/public")
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-sky-700">옷장 등록</h1>

      <div>
        <label className="block text-sm font-medium mb-1">옷장 이름</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">이미지 ID</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={form.imageId}
          onChange={(e) => setForm({ ...form, imageId: Number(e.target.value) })}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
        />
        <label className="text-sm">공개 여부</label>
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