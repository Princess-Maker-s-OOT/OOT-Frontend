"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { VerifyPasswordSchema } from "@/lib/validation"
import { verifyPassword } from "@/lib/api/user"
import type { VerifyPasswordRequest } from "@/lib/validation"

export default function VerifyPassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = VerifyPasswordSchema.safeParse({ password })
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
      const result = await verifyPassword(parsed.data)
      if ("success" in result && result.success) {
        setSuccess("비밀번호가 확인되었습니다.")
        router.push("/my/edit") // ✅ 수정 페이지로 이동
      } else {
        setError(result.message || "비밀번호 확인 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4 text-sky-700">비밀번호 확인</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm font-medium mb-1">현재 비밀번호</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? "확인 중..." : "확인"}
          </button>
        </div>
      </form>
    </div>
  )
}