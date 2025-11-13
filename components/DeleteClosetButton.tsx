"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteCloset } from "@/lib/api/closet"

interface Props {
  closetId: number
}

export default function DeleteClosetButton({ closetId }: Props) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    const confirmed = window.confirm("정말 이 옷장을 삭제하시겠습니까?")
    if (!confirmed) return

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await deleteCloset(closetId, token)
      if ("success" in result && result.success) {
        router.push("/my/closets")
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
    <div className="mt-6">
      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "삭제 중..." : "옷장 삭제"}
      </button>
    </div>
  )
}