"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleOAuthCallback() {
      try {
        // URL에서 토큰 파라미터 확인 (백엔드가 리다이렉트로 토큰을 전달하는 경우)
        const accessToken = searchParams.get("accessToken")
        const refreshToken = searchParams.get("refreshToken")
        const isNewUser = searchParams.get("isNewUser") === "true"

        if (accessToken && refreshToken) {
          // URL 파라미터에서 토큰을 받은 경우
          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", refreshToken)
          router.push(isNewUser ? "/onboarding" : "/")
          return
        }

        // URL에 토큰이 없으면 백엔드 API 호출 (쿠키 기반 인증)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost"}/api/v1/auth/oauth/tokens`, {
          credentials: "include", // 쿠키 포함
        })

        if (!res.ok) {
          throw new Error(`토큰 조회 실패: ${res.status}`)
        }

        const json = await res.json()

        if (json.success && json.data?.accessToken && json.data?.refreshToken) {
          localStorage.setItem("accessToken", json.data.accessToken)
          localStorage.setItem("refreshToken", json.data.refreshToken)
          router.push(json.data.isNewUser ? "/onboarding" : "/")
        } else {
          throw new Error("토큰 응답이 없습니다.")
        }
      } catch (err: any) {
        console.error("OAuth2 로그인 실패:", err)
        setError(err?.message || "OAuth2 로그인에 실패했습니다.")
        setTimeout(() => {
          router.push("/login?error=oauth")
        }, 2000)
      }
    }

    handleOAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-600 mb-4">{error}</div>
            <div className="text-sm text-gray-500">로그인 페이지로 이동합니다...</div>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <div className="text-gray-700">로그인 처리 중입니다...</div>
            <div className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</div>
          </>
        )}
      </div>
    </div>
  )
}