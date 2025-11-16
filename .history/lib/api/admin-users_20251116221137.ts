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
}

/**
 * 관리자 - 회원 상세 조회
 */
export async function getAdminUserDetail(userId: number): Promise<ApiResult<AdminUserItem>> {
  return apiGet<AdminUserItem>(`/api/admin/v1/users/${userId}`, {
    requiresAuth: true
  })
}
