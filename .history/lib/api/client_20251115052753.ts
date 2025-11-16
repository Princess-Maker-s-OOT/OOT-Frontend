/**
 * API 클라이언트 - 인증 헤더 자동 추가
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

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
    const accessToken = localStorage.getItem("accessToken")?.trim()
    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`
    }
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    })

    // 401 에러 시 로그인 페이지로 리다이렉트
    if (response.status === 401 && requiresAuth) {
      console.log("[apiClient] 401 에러 발생 - 토큰 만료, 로그인 페이지로 이동")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      alert("로그인이 만료되었습니다. 다시 로그인해주세요.")
      window.location.href = "/login"
      return response
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
        localStorage.setItem("accessToken", result.data.accessToken.trim())
        localStorage.setItem("refreshToken", result.data.refreshToken.trim())
        return true
      }
    }
  } catch (error) {
    console.error("토큰 갱신 실패:", error)
  }

  return false
}

/**
 * 공통 응답 타입
 */
interface ApiResult<T> {
  success: boolean
  message: string
  data?: T
}

/**
 * GET 요청 헬퍼
 */
export async function apiGet<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  try {
    const response = await apiClient(endpoint, { ...options, method: "GET" })
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}`,
      }
    }
    
    return {
      success: true,
      message: result.message || "성공",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "네트워크 오류",
    }
  }
}

/**
 * POST 요청 헬퍼
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions & { method?: string } = {}
): Promise<ApiResult<T>> {
  try {
    const method = options.method || "POST"
    const response = await apiClient(endpoint, {
      ...options,
      method,
      body: data ? JSON.stringify(data) : undefined,
    })
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}`,
      }
    }
    
    return {
      success: true,
      message: result.message || "성공",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "네트워크 오류",
    }
  }
}

/**
 * PATCH 요청 헬퍼
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  try {
    const response = await apiClient(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}`,
      }
    }
    
    return {
      success: true,
      message: result.message || "성공",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "네트워크 오류",
    }
  }
}

/**
 * PUT 요청 헬퍼
 */
export async function apiPut<T>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  try {
    const response = await apiClient(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}`,
      }
    }
    
    return {
      success: true,
      message: result.message || "성공",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "네트워크 오류",
    }
  }
}

/**
 * DELETE 요청 헬퍼
 */
export async function apiDelete<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResult<T>> {
  try {
    const response = await apiClient(endpoint, { ...options, method: "DELETE" })
    const result = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: result.message || `HTTP ${response.status}`,
      }
    }
    
    return {
      success: true,
      message: result.message || "성공",
      data: result.data,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "네트워크 오류",
    }
  }
}
