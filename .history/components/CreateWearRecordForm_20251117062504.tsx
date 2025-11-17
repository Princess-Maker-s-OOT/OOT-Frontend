"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreateWearRecordSchema } from "@/lib/validation"
import { createWearRecord } from "@/lib/api/wear-record"
import type { CreateWearRecordRequest } from "@/lib/validation"

export default function CreateWearRecordForm() {
  const router = useRouter()
  const [clothesId, setClothesId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = CreateWearRecordSchema.safeParse({ clothesId })
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
      const result = await createWearRecord(parsed.data)
      if ("success" in result && result.success) {
        setSuccess("착용 기록이 등록되었습니다.")
        router.push("/my/wear-records")
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
      <h1 className="text-xl font-bold text-sky-700">착용 기록 등록</h1>

      <div>
        <label className="block text-sm font-medium mb-1">옷 ID</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={clothesId ?? ""}
          onChange={(e) => setClothesId(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500 mt-1">착용한 옷의 ID를 입력해주세요.</p>
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