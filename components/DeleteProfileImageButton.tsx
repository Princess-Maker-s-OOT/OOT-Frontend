"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteProfileImage } from "@/lib/api/user"

export default function DeleteProfileImageButton() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setError(null)
    setSuccess(null)

    const confirmed = window.confirm("정말 프로필 이미지를 삭제하시겠습니까?")
    if (!confirmed) return

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await deleteProfileImage(token)
      if ("success" in result && result.success) {
        setSuccess("프로필 이미지가 삭제되었습니다.")
        router.push("/user/me")
      } else {
        setError(result.message || "삭제 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold text-red-600 mb-4">프로필 이미지 삭제</h1>
      <p className="text-sm text-gray-600 mb-4">
        현재 등록된 프로필 이미지를 삭제합니다. 삭제 후에는 기본 이미지로 대체됩니다.
      </p>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      {success && <div className="text-sm text-green-600 mb-2">{success}</div>}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "삭제 중..." : "이미지 삭제"}
      </button>
    </div>
  )
}