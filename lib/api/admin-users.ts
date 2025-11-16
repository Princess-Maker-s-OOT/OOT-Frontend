/**
 * 관리자 - 회원 관리 API
 */

import { apiGet } from "./client"
import type { ApiResult } from "./client"

export interface AdminUserItem {
  userId: number
  loginId: string
  nickname: string
  username: string
  email: string
  phoneNumber: string | null
  loginType: "LOGIN_ID" | "SOCIAL"
  socialProvider: "GOOGLE" | "KAKAO" | "NAVER" | null
  role: "USER" | "ADMIN"
  createdAt: string
  updatedAt: string
}

export interface AdminUserListResponse {
  content: AdminUserItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

/**
 * 관리자 - 회원 목록 조회
 */
export async function getAdminUsers(
  page: number = 0,
  size: number = 20,
  searchType?: "LOGIN_ID" | "NICKNAME" | "USERNAME" | "EMAIL",
  searchKeyword?: string,
  role?: "USER" | "ADMIN"
): Promise<ApiResult<AdminUserListResponse>> {
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminUsers] 백엔드 API 미구현 - Mock 데이터 반환")
  
  // Mock 데이터 생성
  const mockUsers: AdminUserItem[] = Array.from({ length: size }, (_, i) => ({
    userId: page * size + i + 1,
    loginId: `user${page * size + i + 1}`,
    nickname: `사용자${page * size + i + 1}`,
    username: `홍길동${page * size + i + 1}`,
    email: `user${page * size + i + 1}@example.com`,
    phoneNumber: `010-${String(1000 + i).padStart(4, '0')}-${String(5678 + i).padStart(4, '0')}`,
    loginType: i % 3 === 0 ? "SOCIAL" : "LOGIN_ID",
    socialProvider: i % 3 === 0 ? (i % 2 === 0 ? "KAKAO" : "GOOGLE") : null,
    role: i % 10 === 0 ? "ADMIN" : "USER",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
  }))

  // 필터링 적용
  let filteredUsers = mockUsers
  
  if (role && role !== "ALL" as any) {
    filteredUsers = filteredUsers.filter(u => u.role === role)
  }
  
  if (searchType && searchKeyword) {
    filteredUsers = filteredUsers.filter(u => {
      switch (searchType) {
        case "LOGIN_ID": return u.loginId.includes(searchKeyword)
        case "NICKNAME": return u.nickname.includes(searchKeyword)
        case "USERNAME": return u.username.includes(searchKeyword)
        case "EMAIL": return u.email.includes(searchKeyword)
        default: return true
      }
    })
  }

  await new Promise(resolve => setTimeout(resolve, 300)) // 로딩 시뮬레이션

  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      content: filteredUsers,
      totalElements: 100,
      totalPages: Math.ceil(100 / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(100 / size) - 1,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  let params = `?page=${page}&size=${size}`
  
  if (searchType && searchKeyword) {
    params += `&searchType=${searchType}&searchKeyword=${encodeURIComponent(searchKeyword)}`
  }
  
  if (role) {
    params += `&role=${role}`
  }
  
  return apiGet<AdminUserListResponse>(`/api/admin/v1/users${params}`, {
    requiresAuth: true
  })
  */
}

/**
 * 관리자 - 회원 상세 조회
 */
export async function getAdminUserDetail(userId: number): Promise<ApiResult<AdminUserItem>> {
  return apiGet<AdminUserItem>(`/api/admin/v1/users/${userId}`, {
    requiresAuth: true
  })
}
