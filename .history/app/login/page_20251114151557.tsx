"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { login as apiLogin } from "@/lib/api/auth"

// ✅ Zod 유효성 검사 스키마
const LoginSchema = z.object({
  loginId: z.string().min(4).max(15),
  password: z.string().min(8),
})

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ✅ 폼 제출 핸들러
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // 입력값 검증
    if (!form.loginId || !form.password) {
      setError("아이디와 비밀번호를 모두 입력해주세요")
      return
    }

    const parsed = LoginSchema.safeParse(form)
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => {
        if (e.path[0] === "loginId") return "아이디는 4~15자여야 합니다"
        if (e.path[0] === "password") return "비밀번호는 8자 이상이어야 합니다"
        return e.message
      })
      setError(errors.join(". "))
      return
    }

    setLoading(true)
    try {
      const result = await apiLogin(parsed.data.loginId, parsed.data.password)
      
      if (result.success && result.data) {
        localStorage.setItem("accessToken", result.data.accessToken)
        localStorage.setItem("refreshToken", result.data.refreshToken)

        // JWT 파싱하여 사용자 정보 확인
        const payload = JSON.parse(atob(result.data.accessToken.split('.')[1]))
        console.log("로그인 성공:", { userId: payload.sub, userRole: payload.userRole })

        router.push("/")
      }
    } catch (err: any) {
      console.error("로그인 에러:", err)
      setError(err?.message || "서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  // ✅ 구글 로그인 핸들러
  function handleGoogleLogin() {
    // OAuth2는 /api/v1 prefix 없이 바로 사용
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"
    window.location.href = `${API_BASE}/oauth2/authorization/google`
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">로그인</h1>

      {/* 일반 로그인 폼 */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded border shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">아이디</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.loginId}
            onChange={(e) => setForm({ ...form, loginId: e.target.value })}
            autoComplete="off"
            name="loginId"
            placeholder="아이디를 입력하세요"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">비밀번호</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
            name="password"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </form>

      {/* 소셜 로그인 - 백엔드 OAuth2 설정 완료 후 활성화 */}
      {false && (
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 py-2 rounded hover:bg-gray-100 flex items-center justify-center space-x-3"
          >
            {/* Google SVG 아이콘 */}
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
              <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.2H272v95h146.9c-6.3 34.1-25 62.9-53.3 82.2v68h85.9c50.3-46.3 81-114.5 81-195z"/>
              <path fill="#34A853" d="M272 544.3c72.6 0 133.5-24.1 178-65.5l-85.9-68c-23.8 16-54.3 25.5-92.1 25.5-70.8 0-130.8-47.9-152.3-112.1H31.2v70.4C75.5 475.1 167.5 544.3 272 544.3z"/>
              <path fill="#FBBC05" d="M119.7 324.2c-10.4-30.9-10.4-64.1 0-95l-70.4-70.4C-3.1 222.6-3.1 321.7 49.3 389.6l70.4-65.4z"/>
              <path fill="#EA4335" d="M272 107.7c39.5 0 75 13.6 102.9 40.4l77.4-77.4C405.5 24.1 344.6 0 272 0 167.5 0 75.5 69.2 31.2 170.5l70.4 70.4C141.2 155.6 201.2 107.7 272 107.7z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700">Google 로그인</span>
          </button>
        </div>
      )}
    </div>
  )
}