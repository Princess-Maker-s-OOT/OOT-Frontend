"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UpdateProfileImageSchema } from "@/lib/validation"
import { updateProfileImage } from "@/lib/api/user"
import type { UpdateProfileImageRequest } from "@/lib/validation"

export default function UpdateProfileImageForm() {
  const router = useRouter()
  const [imageId, setImageId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = UpdateProfileImageSchema.safeParse({ imageId })
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
      const result = await updateProfileImage(parsed.data, token)
      if ("success" in result && result.success) {
        setSuccess("프로필 이미지가 수정되었습니다.")
        router.push("/user/me")
      } else {
        setError(result.message || "이미지 수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold text-sky-700">프로필 이미지 수정</h1>

      <div>
        <label className="block text-sm font-medium mb-1">이미지 ID</label>
        <input
          type="number"
          className="w-full border rounded px-3 py-2"
          value={imageId ?? ""}
          onChange={(e) => setImageId(Number(e.target.value))}
        />
        <p className="text-xs text-gray-500 mt-1">등록된 이미지의 ID를 입력해주세요.</p>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "수정 중..." : "이미지 수정"}
        </button>
      </div>
    </form>
  )
}