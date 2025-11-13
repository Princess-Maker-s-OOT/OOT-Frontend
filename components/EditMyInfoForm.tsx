"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UpdateMyInfoSchema } from "@/lib/validation"
import { updateMyInfo } from "@/lib/api/user"
import type { UpdateMyInfoRequest } from "@/lib/validation"

export default function EditMyInfoForm() {
  const router = useRouter()
  const [form, setForm] = useState<UpdateMyInfoRequest>({
    email: null,
    nickname: null,
    username: null,
    password: null,
    phoneNumber: null,
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const parsed = UpdateMyInfoSchema.safeParse(form)
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
      const result = await updateMyInfo(parsed.data, token)
      if ("success" in result && result.success) {
        setSuccess("회원정보가 수정되었습니다.")
        router.push("/user/me")
      } else {
        setError(result.message || "수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-xl mx-auto">
      <h1 className="text-xl font-bold text-sky-700">회원정보 수정</h1>

      <div>
        <label className="block text-sm font-medium mb-1">이메일</label>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          value={form.email ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value || null })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">닉네임</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.nickname ?? ""}
          onChange={(e) => setForm({ ...form, nickname: e.target.value || null })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">이름</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.username ?? ""}
          onChange={(e) => setForm({ ...form, username: e.target.value || null })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">비밀번호</label>
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          value={form.password ?? ""}
          onChange={(e) => setForm({ ...form, password: e.target.value || null })}
        />
        <p className="text-xs text-gray-500 mt-1">영문, 숫자, 특수문자 포함 8자 이상</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">전화번호</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.phoneNumber ?? ""}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value || null })}
        />
        <p className="text-xs text-gray-500 mt-1">예: 01012345678</p>
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