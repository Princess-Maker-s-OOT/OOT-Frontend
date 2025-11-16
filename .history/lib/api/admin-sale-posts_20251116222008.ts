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
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminSalePosts] 백엔드 API 미구현 - Mock 데이터 반환")
  
  const statuses: SalePostStatus[] = ["AVAILABLE", "RESERVED", "COMPLETED", "TRADING"]
  const categories = ["상의", "하의", "아우터", "신발", "가방", "액세서리"]
  
  // Mock 데이터 생성
  const mockPosts: AdminSalePostItem[] = Array.from({ length: size }, (_, i) => ({
    salePostId: page * size + i + 1,
    title: `판매글 제목 ${page * size + i + 1}`,
    content: `판매글 내용입니다.`,
    price: (10000 + i * 5000),
    status: statuses[i % statuses.length],
    tradeAddress: `서울시 강남구 역삼동 ${100 + i}번지`,
    tradeLatitude: 37.5 + (i * 0.001),
    tradeLongitude: 127.0 + (i * 0.001),
    sellerId: i + 1,
    sellerNickname: `판매자${i + 1}`,
    sellerLoginId: `seller${i + 1}`,
    categoryId: (i % categories.length) + 1,
    categoryName: categories[i % categories.length],
    imageUrls: [`https://via.placeholder.com/300?text=Image${i + 1}`],
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 43200000).toISOString(),
  }))

  // 필터링 적용
  let filteredPosts = mockPosts
  
  if (status) {
    filteredPosts = filteredPosts.filter(p => p.status === status)
  }
  
  if (searchType && searchKeyword) {
    filteredPosts = filteredPosts.filter(p => {
      switch (searchType) {
        case "TITLE": return p.title.includes(searchKeyword)
        case "SELLER_NICKNAME": return p.sellerNickname.includes(searchKeyword)
        case "CATEGORY_NAME": return p.categoryName.includes(searchKeyword)
        default: return true
      }
    })
  }

  await new Promise(resolve => setTimeout(resolve, 300)) // 로딩 시뮬레이션

  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      content: filteredPosts,
      totalElements: 200,
      totalPages: Math.ceil(200 / size),
      size,
      number: page,
      first: page === 0,
      last: page >= Math.ceil(200 / size) - 1,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
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
  */
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
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminSalePostStatusCount] 백엔드 API 미구현 - Mock 데이터 반환")
  
  await new Promise(resolve => setTimeout(resolve, 200)) // 로딩 시뮬레이션
  
  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      total: 200,
      available: 120,
      reserved: 45,
      soldOut: 35,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  return apiGet<AdminSalePostStatusCount>("/api/admin/v1/sale-posts/status-count", {
    requiresAuth: true
  })
  */
}
