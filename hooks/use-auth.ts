import { useState, useEffect } from "react"
import { MOCK_USER, mockLogin } from "@/lib/mocks"

export interface AuthState {
  isAuthenticated: boolean
  user: typeof MOCK_USER | null
  token: string | null
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  // 컴포넌트 마운트 시 localStorage에서 토큰 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken")
      const userInfoStr = localStorage.getItem("userInfo")

      if (token) {
        let user = null
        if (userInfoStr) {
          try {
            user = JSON.parse(userInfoStr)
          } catch (e) {
            console.error("userInfo 파싱 실패:", e)
          }
        }

        setAuth({
          isAuthenticated: true,
          user: user,
          token: token,
        })
      }
    }

    // authStateChanged 이벤트 리스너 추가
    const handleAuthChange = () => {
      const token = localStorage.getItem("accessToken")
      const userInfoStr = localStorage.getItem("userInfo")

      if (token) {
        let user = null
        if (userInfoStr) {
          try {
            user = JSON.parse(userInfoStr)
          } catch (e) {
            console.error("userInfo 파싱 실패:", e)
          }
        }

        setAuth({
          isAuthenticated: true,
          user: user,
          token: token,
        })
      } else {
        setAuth({
          isAuthenticated: false,
          user: null,
          token: null,
        })
      }
    }

    window.addEventListener("authStateChanged", handleAuthChange)
    return () => window.removeEventListener("authStateChanged", handleAuthChange)
  }, [])

  const login = (loginId: string, password: string) => {
    const result = mockLogin(loginId, password)
    if (result.success) {
      setAuth({
        isAuthenticated: true,
        user: result.user ?? null,
        token: result.token ?? null,
      })
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userInfo")
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    window.dispatchEvent(new Event("authStateChanged"))
  }

  const setMockUser = () => {
    setAuth({
      isAuthenticated: false,
      user: MOCK_USER,
      token: null,
    })
  }

  return {
    ...auth,
    login,
    logout,
    setMockUser,
  }
}