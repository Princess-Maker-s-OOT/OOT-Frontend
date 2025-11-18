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
  parentId?: number | null
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
import type { ApiResult } from "./client"

export async function getCategories(
  page: number = 0,
  size: number = 100,
  sort: string = "createdAt",
  direction: string = "DESC"
): Promise<ApiResult<PageResponse<CategoryResponse>>> {
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
): Promise<ApiResult<CategoryResponse>> {
  return apiPost("/api/admin/v1/categories", request)
}

/**
 * 카테고리 수정 (관리자)
 * PUT /admin/v1/categories/{categoryId}
 */
export async function updateCategory(
  categoryId: number,
  request: CategoryRequest
): Promise<ApiResult<CategoryResponse>> {
  return apiPut(`/api/admin/v1/categories/${categoryId}`, request)
}

/**
 * 카테고리 삭제 (관리자)
 * DELETE /admin/v1/categories/{categoryId}
 */
export async function deleteCategory(
  categoryId: number
): Promise<ApiResult<void>> {
  return apiDelete(`/api/admin/v1/categories/${categoryId}`)
}

// ==================== 헬퍼 함수 ====================

export interface CategoryNode {
  id: number
  name: string
  children?: CategoryNode[]
}

/**
 * Flat 카테고리 배열을 계층 구조로 변환
 * 백엔드에서 parentId를 제공하지 않으므로 ID 범위로 계층 구조 추론
 * 
 * 구조:
 * - 1-3: 최상위 (남성, 여성, 아동)
 * - 4-11: 남성 중분류
 * - 12-49: 남성 소분류
 * - 50-57: 여성 중분류
 * - 58-91: 여성 소분류
 * - 92-96: 아동 중분류
 * - 97-105: 아동 소분류
 */
export function buildCategoryTree(flatCategories: CategoryResponse[]): CategoryNode[] {
  const sorted = [...flatCategories].sort((a, b) => a.id - b.id)
  const categoryMap = new Map<number, CategoryNode>()
  
  // 모든 카테고리를 노드로 변환
  sorted.forEach((cat) => {
    categoryMap.set(cat.id, {
      id: cat.id,
      name: cat.name,
      children: []
    })
  })

  // 최상위 카테고리 (남성, 여성, 아동)
  const root1 = categoryMap.get(1) // 남성
  const root2 = categoryMap.get(2) // 여성
  const root3 = categoryMap.get(3) // 아동

  if (!root1 || !root2 || !root3) {
    // 최상위 카테고리가 없으면 flat 구조 반환
    return Array.from(categoryMap.values())
  }

  // 남성 계층 구조 (ID 4-49)
  const menMid = sorted.filter(c => c.id >= 4 && c.id <= 11) // 중분류
  const menLeaf = sorted.filter(c => c.id >= 12 && c.id <= 49) // 소분류
  
  menMid.forEach((mid) => {
    const midNode = categoryMap.get(mid.id)!
    root1.children!.push(midNode)
    
    // 각 중분류에 소분류 할당 (ID 범위로 추정)
    const midIdRanges: Record<number, [number, number]> = {
      4: [12, 18],   // 아우터 → 자켓~후드집업
      5: [19, 25],   // 상의 → 반팔티~민소매
      6: [26, 30],   // 하의 → 청바지~트레이닝팬츠
      7: [31, 35],   // 신발 → 스니커즈~구두
      8: [36, 39],   // 가방 → 백팩~토트백
      9: [40, 45],   // 액세서리 → 모자~머플러/스카프
      10: [46, 47],  // 이너웨어 → 러닝/탱크탑~드로즈/트렁크
      11: [48, 49],  // 라이프웨어 → 홈웨어~스포츠웨어
    }
    
    const range = midIdRanges[mid.id]
    if (range) {
      const [start, end] = range
      menLeaf.filter(c => c.id >= start && c.id <= end).forEach((leaf) => {
        midNode.children!.push(categoryMap.get(leaf.id)!)
      })
    }
  })

  // 여성 계층 구조 (ID 50-91)
  const womenMid = sorted.filter(c => c.id >= 50 && c.id <= 57) // 중분류
  const womenLeaf = sorted.filter(c => c.id >= 58 && c.id <= 91) // 소분류
  
  womenMid.forEach((mid) => {
    const midNode = categoryMap.get(mid.id)!
    root2.children!.push(midNode)
    
    const midIdRanges: Record<number, [number, number]> = {
      50: [58, 62],  // 아우터 → 코트~패딩
      51: [63, 66],  // 상의 → 블라우스~후드티
      52: [67, 70],  // 하의 → 스커트~슬랙스
      53: [71, 75],  // 신발 → 플랫슈즈~로퍼
      54: [76, 79],  // 가방 → 크로스백~미니백
      55: [80, 85],  // 액세서리 → 목걸이~스카프
      56: [86, 88],  // 원피스 → 캐주얼원피스~미니원피스
      57: [89, 91],  // 이너웨어 → 브라탑~스타킹
    }
    
    const range = midIdRanges[mid.id]
    if (range) {
      const [start, end] = range
      womenLeaf.filter(c => c.id >= start && c.id <= end).forEach((leaf) => {
        midNode.children!.push(categoryMap.get(leaf.id)!)
      })
    }
  })

  // 아동 계층 구조 (ID 범위 기반)
  // 중분류: 92~96, 소분류: 97~105
  const childMid = sorted.filter(c => c.id >= 92 && c.id <= 96)
  const childLeaf = sorted.filter(c => c.id >= 97 && c.id <= 105)

  // 중분류별 소분류 ID 범위 (단일 값/범위 모두 지원)
  const childIdRanges: Record<number, number[]> = {
    92: [97, 98],   // 아우터
    93: [99, 100],  // 상의
    94: [101, 102], // 하의
    95: [103],      // 신발
    96: [104, 105], // 액세서리
  }

  childMid.forEach((mid) => {
    const midNode = categoryMap.get(mid.id)!
    root3.children!.push(midNode)
    const ids = childIdRanges[mid.id]
    if (ids) {
      ids.forEach((id) => {
        const leafNode = categoryMap.get(id)
        if (leafNode) midNode.children!.push(leafNode)
      })
    }
  })

  return [root1, root2, root3]
}
