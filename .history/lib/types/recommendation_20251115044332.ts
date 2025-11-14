// 추천 타입
export type RecommendationType = "SALE" | "DONATION"

// 추천 상태
export type RecommendationStatus = "PENDING" | "ACCEPTED" | "REJECTED"

// 배치 상태
export type BatchStatus = "RUNNING" | "SUCCESS" | "FAILED"

// 추천 아이템 (기존 호환성 유지)
export interface RecommendationItem {
  recommendationId: number
  userId: number
  clothesId: number
  clothesName: string
  clothesImageUrl: string | null
  type: RecommendationType
  reason: string
  status: RecommendationStatus
  createdAt: string
  updatedAt: string
}

// Legacy alias: 하위 호환성 유지
export type Recommendation = RecommendationItem

// 추천 생성 응답
export interface RecommendationCreateResponse {
  recommendationId: number
  userId: number
  clothesId: number
  type: RecommendationType
  reason: string
  status: RecommendationStatus
  createdAt: string
  updatedAt: string
}

// 내 추천 조회 응답
export interface RecommendationGetMyResponse {
  recommendationId: number
  userId: number
  clothesId: number
  clothesName: string
  clothesImageUrl: string | null
  type: RecommendationType
  reason: string
  status: RecommendationStatus
  createdAt: string
  updatedAt: string
}

// 추천으로부터 판매글 생성 요청
export interface RecommendationSalePostCreateRequest {
  title: string
  content: string
  price: number
  categoryId: number
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  imageUrls: string[]
}

// 배치 실행 이력 응답
export interface RecommendationBatchHistoryResponse {
  id: number
  startTime: string
  endTime: string | null
  status: BatchStatus
  totalUsers: number | null
  successUsers: number | null
  failedUsers: number | null
  totalRecommendations: number | null
  executionTimeMs: number | null
  errorMessage: string | null
}

// 배치 실행 이력 목록 응답
export interface RecommendationBatchHistoryListResponse {
  histories: RecommendationBatchHistoryResponse[]
  currentPage: number
  totalPages: number
  totalElements: number
  hasNext: boolean
}