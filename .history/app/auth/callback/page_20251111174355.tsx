"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const tempCode = searchParams.get("code")
    const error = searchParams.get("error")

    if (error) {
      setStatus("error")
      setMessage(decodeURIComponent(error))
      return
    }

    if (!tempCode) {
      setStatus("error")
      setMessage("인증 코드가 없습니다.")
      return
    }

    // 임시 코드를 백엔드로 전송하여 토큰 획득
    const exchangeToken = async () => {
      try {
        const response = await fetch("/api/v1/auth/oauth-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: tempCode }),
        })

        const result = await response.json()

        if (result.success && result.data) {
          // 토큰 저장
          localStorage.setItem("accessToken", result.data.accessToken)
          localStorage.setItem("refreshToken", result.data.refreshToken)

          setStatus("success")
          setMessage("로그인 성공")

          // 2초 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push("/")
          }, 2000)
        } else {
          setStatus("error")
          setMessage(result.message || "토큰 교환 실패")
        }
      } catch (err) {
        setStatus("error")
        setMessage("서버 통신 오류")
      }
    }

    exchangeToken()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oot-sky-50 to-white p-4">
      <Card className="w-full max-w-md border-oot-sky-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인 처리 중</CardTitle>
          <CardDescription>잠시만 기다려주세요...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 text-oot-sky-accent animate-spin" />
              <p className="text-gray-600">Google 계정으로 로그인 중입니다...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="text-gray-600 font-semibold">{message}</p>
              <p className="text-sm text-gray-500">곧 홈페이지로 이동합니다...</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-red-600" />
              <p className="text-gray-600 font-semibold">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 bg-oot-sky-accent text-white px-4 py-2 rounded hover:bg-sky-600"
              >
                로그인 페이지로 돌아가기
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
