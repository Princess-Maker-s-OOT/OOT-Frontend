import {
  ApiErrorResponse,
  ApiResponse,
  ApiSuccessResponse,
  HTTP_STATUS,
  HTTP_STATUS_VALUE,
} from "@/lib/types/common"

// Next.js 프록시를 사용하므로 빈 문자열 사용
const API_BASE_URL = ""

interface FetchOptions extends RequestInit {
  accessToken?: string
}

/**
 * API 호출을 위한 기본 fetch 함수
 */
async function apiFetch<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  const { accessToken, ...fetchOptions } = options
  const headers = new Headers(options.headers)

  // Content-Type이 설정되지 않은 경우 기본값 설정
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }

  // accessToken이 있는 경우 Authorization 헤더 추가
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`)
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })

    const result = await response.json()

    // 성공 응답인 경우 그대로 반환
    if (response.ok && result.success) {
      return result as TSuccess
    }

    // 에러 응답 생성
    return {
      httpStatus: result.httpStatus ?? HTTP_STATUS.BAD_REQUEST,
      statusValue: result.statusValue ?? HTTP_STATUS_VALUE.BAD_REQUEST,
      success: false,
      code: result.code ?? "UNKNOWN_ERROR",
      message: result.message ?? "알 수 없는 오류가 발생했습니다.",
      data: result.data ?? "서버 응답 오류",
      timestamp: result.timestamp ?? new Date().toISOString(),
    } as TError
  } catch (error) {
    // 네트워크 오류 등 예외 발생 시
    return {
      httpStatus: HTTP_STATUS.BAD_REQUEST,
      statusValue: HTTP_STATUS_VALUE.BAD_REQUEST,
      success: false,
      code: "NETWORK_ERROR",
      message: "서버와 연결할 수 없습니다.",
      data: String(error),
      timestamp: new Date().toISOString(),
    } as TError
  }
}

/**
 * URL 쿼리 파라미터 생성 유틸리티
 */
export function createQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ""
}

/**
 * HTTP GET 요청
 */
export async function apiGet<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  return apiFetch<TSuccess, TError>(endpoint, { ...options, method: "GET" })
}

/**
 * HTTP POST 요청
 */
export async function apiPost<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  return apiFetch<TSuccess, TError>(endpoint, {
    ...options,
    method: "POST",
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}

/**
 * HTTP PUT 요청
 */
export async function apiPut<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  return apiFetch<TSuccess, TError>(endpoint, {
    ...options,
    method: "PUT",
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}

/**
 * HTTP PATCH 요청
 */
export async function apiPatch<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  data?: any,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  return apiFetch<TSuccess, TError>(endpoint, {
    ...options,
    method: "PATCH",
    body: data instanceof FormData ? data : JSON.stringify(data),
  })
}

/**
 * HTTP DELETE 요청
 */
export async function apiDelete<TSuccess extends ApiSuccessResponse<unknown>, TError extends ApiErrorResponse>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<TSuccess | TError> {
  return apiFetch<TSuccess, TError>(endpoint, { ...options, method: "DELETE" })
}