"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { exchangeOAuthToken } from "@/lib/api/auth"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const executeAuth = async () => {
      // 1. 에러 파라미터 체크
      const error = searchParams.get("error")
      if (error) {
        setStatus("error")
        setMessage(decodeURIComponent(error))
        setTimeout(() => router.push("/login"), 3000)
        return
      }

      // 2. 임시 코드 방식 (백엔드 OAuth2 리다이렉트)
      const tempCode = searchParams.get("code")
      if (tempCode) {
        console.log("🔐 OAuth2 임시 코드 수신:", tempCode)
        
        try {
          const result = await exchangeOAuthToken(tempCode)

          if (result.success && result.data) {
            // 토큰에서 "Bearer " prefix 제거 후 저장
            const accessToken = result.data.accessToken.replace(/^Bearer\s+/i, '').trim()
            const refreshToken = result.data.refreshToken.replace(/^Bearer\s+/i, '').trim()
            
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            
            console.log("🔐 토큰 저장 완료:", {
              accessToken: accessToken.substring(0, 20) + "...",
              refreshToken: refreshToken.substring(0, 20) + "...",
              stored: {
                access: !!localStorage.getItem("accessToken"),
                refresh: !!localStorage.getItem("refreshToken")
              }
            })

            // JWT 파싱 및 사용자 정보 저장
            try {
              const payload = JSON.parse(atob(accessToken.split(".")[1]))
              
              // 관리자 여부 확인
              const isAdmin = payload.userRole === "ADMIN" || 
                             payload.role === "ADMIN" || 
                             payload.authorities?.includes("ROLE_ADMIN")
              
              const userRole = isAdmin ? "ADMIN" : "USER"
              
              console.log("✅ OAuth 로그인 성공:", {
                userId: payload.sub,
                userRole: payload.userRole || payload.role,
                calculatedRole: userRole,
                authorities: payload.authorities
              })

              // 사용자 정보 API 호출
              try {
                const userInfoResponse = await fetch("/api/v1/user/me", {
                  headers: {
                    Authorization: `Bearer ${accessToken}`
                  }
                })
                
                if (userInfoResponse.ok) {
                  const userInfoResult = await userInfoResponse.json()
                  if (userInfoResult.success && userInfoResult.data) {
                    localStorage.setItem("userInfo", JSON.stringify({
                      ...userInfoResult.data,
                      role: userRole
                    }))
                    console.log("✅ 사용자 정보 저장 완료:", { role: userRole })
                  }
                } else {
                  // API 실패 시 기본 정보 저장
                  localStorage.setItem("userInfo", JSON.stringify({
                    userId: payload.sub,
                    role: userRole
                  }))
                  console.log("⚠️ userInfo API 실패, 기본 정보 저장:", { role: userRole })
                }
              } catch (apiError) {
                // API 호출 실패 시에도 기본 정보 저장
                localStorage.setItem("userInfo", JSON.stringify({
                  userId: payload.sub,
                  role: userRole
                }))
                console.warn("⚠️ userInfo API 에러, 기본 정보 저장:", apiError)
              }
            } catch (parseError) {
              console.warn("JWT 파싱 실패, 계속 진행:", parseError)
            }

            // 상태 변경 이벤트 발생
            window.dispatchEvent(new Event("authStateChanged"))
            console.log("📢 authStateChanged 이벤트 발생")

            setStatus("success")
            setMessage("로그인 성공")

            setTimeout(() => {
              router.push("/")
            }, 1500)
          } else {
            setStatus("error")
            setMessage(result.message || "토큰 교환 실패")
            setTimeout(() => router.push("/login"), 3000)
          }
        } catch (err: any) {
          console.error("❌ OAuth 토큰 교환 에러:", err)
          setStatus("error")
          setMessage(err?.message || "인증 처리 중 오류가 발생했습니다.")
          setTimeout(() => router.push("/login"), 3000)
        }
        return
      }

      // 3. 직접 토큰 방식 (URL에 token이 직접 포함된 경우 - 백업)
      const accessToken = searchParams.get("token") || searchParams.get("accessToken")
      const refreshToken = searchParams.get("refreshToken")
      
      if (accessToken && refreshToken) {
        console.log("🔐 직접 토큰 수신 (레거시)")
        
        try {
          localStorage.setItem("accessToken", accessToken)
          localStorage.setItem("refreshToken", refreshToken)

          // JWT 파싱 및 사용자 정보 저장
          try {
            const payload = JSON.parse(atob(accessToken.split(".")[1]))
            
            // 관리자 여부 확인
            const isAdmin = payload.userRole === "ADMIN" || 
                           payload.role === "ADMIN" || 
                           payload.authorities?.includes("ROLE_ADMIN")
            
            const userRole = isAdmin ? "ADMIN" : "USER"
            
            console.log("✅ 직접 토큰 로그인 성공:", {
              userId: payload.sub,
              userRole: payload.userRole || payload.role,
              calculatedRole: userRole,
            })

            // 사용자 정보 API 호출 또는 기본 정보 저장
            try {
              const userInfoResponse = await fetch("/api/v1/user/me", {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              })
              
              if (userInfoResponse.ok) {
                const userInfoResult = await userInfoResponse.json()
                if (userInfoResult.success && userInfoResult.data) {
                  localStorage.setItem("userInfo", JSON.stringify({
                    ...userInfoResult.data,
                    role: userRole
                  }))
                }
              } else {
                localStorage.setItem("userInfo", JSON.stringify({
                  userId: payload.sub,
                  role: userRole
                }))
              }
            } catch {
              localStorage.setItem("userInfo", JSON.stringify({
                userId: payload.sub,
                role: userRole
              }))
            }
          } catch (parseError) {
            console.warn("JWT 파싱 실패:", parseError)
          }

          // 상태 변경 이벤트 발생
          window.dispatchEvent(new Event("authStateChanged"))

          setStatus("success")
          setMessage("로그인 성공")

          setTimeout(() => {
            router.push("/")
          }, 1500)
        } catch (err) {
          console.error("❌ 토큰 파싱 에러:", err)
          setStatus("error")
          setMessage("인증 정보 처리 중 오류가 발생했습니다.")
          setTimeout(() => router.push("/login"), 3000)
        }
        return
      }

      // 4. 파라미터가 없는 경우
      console.warn("❌ 인증 파라미터 없음")
      setStatus("error")
      setMessage("인증 정보를 찾을 수 없습니다.")
      setTimeout(() => router.push("/login"), 3000)
    }

    executeAuth()
  }, [searchParams, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-oot-sky-50 to-white p-4">
      <Card className="w-full max-w-md border-oot-sky-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">로그인 처리 중</CardTitle>
          <CardDescription>잠시만 기다려주세요...</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-oot-sky-accent" />
              <p className="text-gray-600">Google 계정으로 로그인 중입니다...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="font-semibold text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">곧 홈페이지로 이동합니다...</p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-red-600" />
              <p className="font-semibold text-gray-600">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 rounded bg-oot-sky-accent px-4 py-2 text-white hover:bg-sky-600"
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
