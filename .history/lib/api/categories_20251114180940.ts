/**
 * 카테고리 관련 API 클라이언트
 */

import { apiGet, apiPost, apiPut, apiDelete } from "./client"

const API_PREFIX = "/api/v1"

// ==================== 요청 타입 ====================

export interface CategoryRequest {
  parentId?: number | null
  name: string
}

// ==================== 응답 타입 ====================

export interface CategoryResponse {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  first: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
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
 * 카테고리 목록 조회
 * GET /v1/categories
 */
export async function getCategories(
  page: number = 0,
  size: number = 100,
  sort: string = "createdAt",
  direction: string = "DESC"
): Promise<ApiResponse<PageResponse<CategoryResponse>>> {
  return apiGet(
    `${API_PREFIX}/categories?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { requiresAuth: false }
  )
}

/**
 * 카테고리 생성 (관리자)
 * POST /admin/v1/categories
 */
export async function createCategory(
  request: CategoryRequest
): Promise<ApiResponse<CategoryResponse>> {
  return apiPost("/api/admin/v1/categories", request)
}

/**
 * 카테고리 수정 (관리자)
 * PUT /admin/v1/categories/{categoryId}
 */
export async function updateCategory(
  categoryId: number,
  request: CategoryRequest
): Promise<ApiResponse<CategoryResponse>> {
  return apiPut(`/api/admin/v1/categories/${categoryId}`, request)
}

/**
 * 카테고리 삭제 (관리자)
 * DELETE /admin/v1/categories/{categoryId}
 */
export async function deleteCategory(
  categoryId: number
): Promise<ApiResponse<void>> {
  return apiDelete(`/api/admin/v1/categories/${categoryId}`)
}
