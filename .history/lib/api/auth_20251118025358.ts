/**
 * 인증 관련 API 클라이언트
 * 백엔드 AuthController 엔드포인트와 매핑
 */

import { getDeviceInfo } from "../utils/device"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ""

// ==================== 요청 타입 ====================

export interface SignupRequest {
  loginId: string
  email: string
  nickname: string
  username: string
  password: string
  phoneNumber: string
}

export interface LoginRequest {
  loginId: string
  password: string
  deviceId: string
  deviceName: string
}

export interface RefreshTokenRequest {
  refreshToken: string
  deviceId: string
}

export interface TokenExchangeRequest {
  code: string
  deviceId: string
  deviceName: string
}

export interface WithdrawRequest {
  password?: string // 소셜 로그인 사용자는 optional
}

// ==================== 응답 타입 ====================

export interface AuthLoginResponse {
  accessToken: string
  refreshToken: string
}

export interface DeviceInfoResponse {
  deviceId: string
  deviceName: string
  lastUsedAt: string
  expiresAt: string
  isCurrent: boolean
  ipAddress: string
  userAgent: string
}

export interface ApiResponse<T> {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
  data: T
}

// ==================== API 함수 ====================

/**
 * 회원가입
 */
export async function signup(request: SignupRequest): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  const result = await response.json()
  
  if (!response.ok) {
    throw new Error(result.message || "회원가입에 실패했습니다")
  }

  return result
}

/**
 * 로그인
 */
export async function login(
  loginId: string,
  password: string
): Promise<ApiResponse<AuthLoginResponse>> {
  const { deviceId, deviceName } = getDeviceInfo()

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      loginId,
      password,
      deviceId,
      deviceName,
    } as LoginRequest),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "로그인에 실패했습니다")
  }

  return result
}

/**
 * 토큰 재발급
 */
export async function refreshToken(
  refreshToken: string
): Promise<ApiResponse<AuthLoginResponse>> {
  const { deviceId } = getDeviceInfo()

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken,
      deviceId,
    } as RefreshTokenRequest),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "토큰 갱신에 실패했습니다")
  }

  return result
}

/**
 * OAuth2 임시 코드 교환
 */
export async function exchangeOAuthToken(
  code: string
): Promise<ApiResponse<AuthLoginResponse>> {
  const { deviceId, deviceName } = getDeviceInfo()

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/oauth2/token/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      deviceId,
      deviceName,
    } as TokenExchangeRequest),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "토큰 교환에 실패했습니다")
  }

  return result
}

/**
 * 로그아웃 (특정 디바이스)
 */
export async function logout(): Promise<ApiResponse<void>> {
  const { deviceId } = getDeviceInfo()
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout?deviceId=${deviceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "로그아웃에 실패했습니다")
  }

  // 토큰 삭제
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")

  return result
}

/**
 * 전체 로그아웃 (모든 디바이스)
 */
export async function logoutAll(): Promise<ApiResponse<void>> {
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/logout/all`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "전체 로그아웃에 실패했습니다")
  }

  // 토큰 삭제
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")

  return result
}

/**
 * 내 디바이스 목록 조회
 */
export async function getDeviceList(): Promise<ApiResponse<DeviceInfoResponse[]>> {
  const { deviceId } = getDeviceInfo()
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/devices?currentDeviceId=${deviceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "디바이스 목록 조회에 실패했습니다")
  }

  return result
}

/**
 * 특정 디바이스 제거
 */
export async function removeDevice(targetDeviceId: string): Promise<ApiResponse<void>> {
  const { deviceId: currentDeviceId } = getDeviceInfo()
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다")
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/devices/${targetDeviceId}?currentDeviceId=${currentDeviceId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "디바이스 제거에 실패했습니다")
  }

  return result
}

/**
 * 회원탈퇴
 */
export async function withdraw(password?: string): Promise<ApiResponse<void>> {
  const accessToken = localStorage.getItem("accessToken")

  if (!accessToken) {
    throw new Error("로그인 상태가 아닙니다")
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/auth/withdraw`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      password,
    } as WithdrawRequest),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "회원탈퇴에 실패했습니다")
  }

  // 토큰 삭제
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")

  return result
}
