/**
 * API 클라이언트 - 인증 헤더 자동 추가
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

/**
 * 인증이 필요한 API 요청을 위한 fetch wrapper
 */
export async function apiClient(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options

  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${API_BASE_URL}${endpoint}`

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  }

  // 인증이 필요한 경우 Authorization 헤더 추가
  if (requiresAuth) {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    })

    // 401 에러 시 토큰 갱신 시도
    if (response.status === 401 && requiresAuth) {
      const refreshed = await refreshAccessToken()
      if (refreshed) {
        // 토큰 갱신 성공 시 재시도
        const newToken = localStorage.getItem("accessToken")
        if (newToken) {
          const retryHeaders: HeadersInit = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${newToken}`,
            ...headers,
          }
          return fetch(url, {
            ...restOptions,
            headers: retryHeaders,
          })
        }
      } else {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
      }
    }

    return response
  } catch (error) {
    console.error("API 요청 실패:", error)
    throw error
  }
}

/**
 * 액세스 토큰 갱신
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) return false

  try {
    const { getDeviceId } = await import("../utils/device")
    const deviceId = getDeviceId()

    const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken, deviceId }),
    })

    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        localStorage.setItem("accessToken", result.data.accessToken)
        localStorage.setItem("refreshToken", result.data.refreshToken)
        return true
      }
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error)
  }

  return false
}

/**
 * GET 요청 헬퍼
 */
export async function apiGet<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiClient(endpoint, { ...options, method: "GET" })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json()
}

/**
 * POST 요청 헬퍼
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json()
}

/**
 * PUT 요청 헬퍼
 */
export async function apiPut<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiClient(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json()
}

/**
 * DELETE 요청 헬퍼
 */
export async function apiDelete<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await apiClient(endpoint, { ...options, method: "DELETE" })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `HTTP ${response.status}`)
  }
  return response.json()
}
