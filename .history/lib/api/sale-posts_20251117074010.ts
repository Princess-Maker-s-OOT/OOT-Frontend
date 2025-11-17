import type { ApiResult } from "./client"
/**
 * 판매글 관련 API 클라이언트
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// ==================== 요청 타입 ====================

export interface SalePostCreateRequest {
  title: string
  content: string
  price: number
  categoryId: number
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  imageUrls: string[]
}

export interface SalePostUpdateRequest {
  title: string
  content: string
  price: number
  categoryId: number
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  imageUrls: string[]
}

export interface SaleStatusUpdateRequest {
  status: SaleStatus
}

// ==================== 응답 타입 ====================

export enum SaleStatus {
  AVAILABLE = "AVAILABLE",   // 판매중
  RESERVED = "RESERVED",     // 예약됨
  TRADING = "TRADING",       // 거래중
  COMPLETED = "COMPLETED",   // 거래완료
  CANCELLED = "CANCELLED",   // 취소됨
  DELETED = "DELETED"        // 삭제됨
}

export interface SalePostCreateResponse {
  salePostId: number
  title: string
  content: string
  price: number
  status: SaleStatus
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  userId: number
  categoryId: number
  imageUrls: string[]
  createdAt: string
}

export interface SalePostDetailResponse {
  salePostId: number
  title: string
  content: string
  price: number
  status: SaleStatus
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  sellerId: number
  sellerNickname: string
  sellerImageUrl: string | null
  categoryName: string
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export interface SalePostListResponse {
  salePostId: number
  title: string
  price: number
  status: SaleStatus
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  thumbnailUrl: string | null
  sellerNickname: string
  categoryName: string
  createdAt: string
}

export interface SalePostSummaryResponse {
  salePostId: number
  title: string
  price: number
  status: SaleStatus
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  thumbnailUrl: string | null
  createdAt: string
}

export interface SliceResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  first: boolean
  last: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
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
 * 판매글 생성
 */
export async function createSalePost(
  request: SalePostCreateRequest
): Promise<ApiResult<SalePostCreateResponse>> {
  return apiPost(`${API_BASE_URL}/api/v1/sale-posts`, request)
}

/**
 * 판매글 상세 조회
 */
export async function getSalePostDetail(
  salePostId: number
): Promise<ApiResult<SalePostDetailResponse>> {
  return apiGet(`${API_BASE_URL}/api/v1/sale-posts/${salePostId}`)
}

/**
 * 판매글 전체 조회 (필터링)
 */
export async function getSalePosts(params: {
  categoryId?: number
  status?: SaleStatus
  keyword?: string
  page?: number
  size?: number
  sort?: string
  direction?: string
}): Promise<ApiResult<SliceResponse<SalePostListResponse>>> {
  const queryParams = new URLSearchParams()
  
  if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString())
  if (params.status) queryParams.append("status", params.status)
  if (params.keyword) queryParams.append("keyword", params.keyword)
  if (params.page !== undefined) queryParams.append("page", params.page.toString())
  if (params.size !== undefined) queryParams.append("size", params.size.toString())
  if (params.sort) queryParams.append("sort", params.sort)
  if (params.direction) queryParams.append("direction", params.direction)

  return apiGet<SliceResponse<SalePostListResponse>>(`${API_BASE_URL}/api/v1/sale-posts?${queryParams.toString()}`)
}

/**
 * 판매글 수정
 */
export async function updateSalePost(
  salePostId: number,
  request: SalePostUpdateRequest
): Promise<ApiResult<SalePostDetailResponse>> {
  return apiPut<SalePostDetailResponse>(`${API_BASE_URL}/api/v1/sale-posts/${salePostId}`, request)
}

/**
 * 판매글 삭제
 */
export async function deleteSalePost(
  salePostId: number
): Promise<ApiResult<void>> {
  return apiDelete(`${API_BASE_URL}/api/v1/sale-posts/${salePostId}`)
}

/**
 * 판매글 상태 변경
 */
export async function updateSaleStatus(
  salePostId: number,
  status: SaleStatus
): Promise<ApiResult<SalePostDetailResponse>> {
  return apiPost<SalePostDetailResponse>(`${API_BASE_URL}/api/v1/sale-posts/${salePostId}/status`, { status })
}

/**
 * 내 판매글 조회
 */
export async function getMySalePosts(params: {
  status?: SaleStatus
  page?: number
  size?: number
  sort?: string
  direction?: "ASC" | "DESC"
}): Promise<ApiResponse<SliceResponse<SalePostSummaryResponse>>> {
  const queryParams = new URLSearchParams()
  
  if (params.status) queryParams.append("status", params.status)
  if (params.page !== undefined) queryParams.append("page", params.page.toString())
  if (params.size !== undefined) queryParams.append("size", params.size.toString())
  if (params.sort) queryParams.append("sort", params.sort)
  if (params.direction) queryParams.append("direction", params.direction)

  return apiGet(`${API_BASE_URL}/api/v1/sale-posts/my?${queryParams.toString()}`)
}
