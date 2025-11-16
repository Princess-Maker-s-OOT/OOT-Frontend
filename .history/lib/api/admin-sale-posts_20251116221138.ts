/**
 * 관리자 - 판매글 관리 API
 */

import { apiGet } from "./client"
import type { ApiResult } from "./client"
import type { SalePostStatus } from "@/lib/types/sale-post"

export interface AdminSalePostItem {
  salePostId: number
  title: string
  content: string
  price: number
  status: SalePostStatus
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  sellerId: number
  sellerNickname: string
  sellerLoginId: string
  categoryId: number
  categoryName: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface AdminSalePostListResponse {
  content: AdminSalePostItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
}

export interface AdminSalePostStatusCount {
  total: number
  available: number
  reserved: number
  soldOut: number
}

/**
 * 관리자 - 판매글 목록 조회
 */
export async function getAdminSalePosts(
  page: number = 0,
  size: number = 20,
  status?: SalePostStatus,
  searchType?: "TITLE" | "SELLER_NICKNAME" | "CATEGORY_NAME",
  searchKeyword?: string
): Promise<ApiResult<AdminSalePostListResponse>> {
  let params = `?page=${page}&size=${size}`
  
  if (status) {
    params += `&status=${status}`
  }
  
  if (searchType && searchKeyword) {
    params += `&searchType=${searchType}&searchKeyword=${encodeURIComponent(searchKeyword)}`
  }
  
  return apiGet<AdminSalePostListResponse>(`/api/admin/v1/sale-posts${params}`, {
    requiresAuth: true
  })
}

/**
 * 관리자 - 판매글 상세 조회
 */
export async function getAdminSalePostDetail(salePostId: number): Promise<ApiResult<AdminSalePostItem>> {
  return apiGet<AdminSalePostItem>(`/api/admin/v1/sale-posts/${salePostId}`, {
    requiresAuth: true
  })
}

/**
 * 관리자 - 판매글 상태별 통계
 */
export async function getAdminSalePostStatusCount(): Promise<ApiResult<AdminSalePostStatusCount>> {
  return apiGet<AdminSalePostStatusCount>("/api/admin/v1/sale-posts/status-count", {
    requiresAuth: true
  })
}
