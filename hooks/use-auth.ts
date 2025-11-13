import { useState } from "react"
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
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    })
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