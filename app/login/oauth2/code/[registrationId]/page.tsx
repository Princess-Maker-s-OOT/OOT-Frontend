"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OAuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    async function fetchTokens() {
      try {
        const res = await fetch("http://localhost:8080/api/v1/auth/oauth/callback", {
          credentials: "include", // 쿠키 포함
        })

        const json = await res.json()

        if (json.accessToken && json.refreshToken) {
          localStorage.setItem("accessToken", json.accessToken)
          localStorage.setItem("refreshToken", json.refreshToken)

          router.push(json.isNewUser ? "/onboarding" : "/")
        } else {
          throw new Error("토큰 응답이 없습니다.")
        }
      } catch (err) {
        console.error("OAuth2 로그인 실패:", err)
        router.push("/login?error=oauth")
      }
    }

    fetchTokens()
  }, [router])

  return (
    <div className="p-6 text-sm text-gray-500">
      로그인 처리 중입니다. 잠시만 기다려주세요...
    </div>
  )
}