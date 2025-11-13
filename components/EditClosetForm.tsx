"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UpdateClosetSchema } from "@/lib/validation"
import { updateCloset, getClosetById } from "@/lib/api/closet"
import type { UpdateClosetRequest } from "@/lib/validation"
import type { ClosetDetailData } from "@/lib/types/closet"

interface Props {
  closetId: number
}

export default function EditClosetForm({ closetId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<UpdateClosetRequest>({
    name: "",
    description: "",
    imageId: 0,
    isPublic: false,
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getClosetById(closetId, token).then((res) => {
      if ("data" in res && res.data) {
        const { name, description, imageUrl, isPublic } = res.data
        setForm({
          name,
          description,
          imageId: 0, // 실제 imageId는 별도 관리 필요
          isPublic,
        })
      } else {
        setError((res as any)?.message ?? "오류가 발생했습니다.")
      }
    })
  }, [closetId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = UpdateClosetSchema.safeParse(form)
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
      const result = await updateCloset(closetId, parsed.data, token)
      if ((result as any)?.success) {
        setSuccess("옷장 정보가 수정되었습니다.")
        router.push(`/closets/${closetId}`)
      } else {
        setError((result as any)?.message ?? "수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-sky-700">옷장 정보 수정</h1>

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
          {loading ? "수정 중..." : "수정 완료"}
        </button>
      </div>
    </form>
  )
}