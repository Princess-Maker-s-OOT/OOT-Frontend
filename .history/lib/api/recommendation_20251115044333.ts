import { apiGet, apiPost } from "./client"
import type { ApiResult } from "./client"
import type { PageResponse } from "../types/common"
import type { DonationCenterSearchResponse } from "../types/donation"
import type { SalePostCreateResponse } from "../types/sale-post"
import type {
  RecommendationCreateResponse,
  RecommendationGetMyResponse,
  RecommendationSalePostCreateRequest,
  RecommendationBatchHistoryResponse,
  RecommendationBatchHistoryListResponse,
} from "../types/recommendation"

/**
 * 추천 기록 수동 생성
 * 로그인한 사용자의 옷을 즉시 조회하여 1년 이상 미착용 옷에 대한 추천 기록을 생성합니다.
 * 스케줄러를 기다리지 않고 즉시 추천을 받고 싶을 때 사용합니다.
 * 
 * @returns 생성된 추천 기록 목록
 */
export async function generateRecommendations(): Promise<
  ApiResult<RecommendationCreateResponse[]>
> {
  return apiPost<RecommendationCreateResponse[]>("/v1/recommendations", {}, {
    requiresAuth: true,
  })
}

/**
 * 추천 기록 목록 조회
 * 로그인한 사용자의 기부/판매 추천 목록을 페이징하여 조회합니다.
 * 
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지 크기
 * @param sort - 정렬 기준 필드 (기본값: createdAt)
 * @param direction - 정렬 방향 (기본값: DESC)
 * @returns 추천 목록 페이지 응답
 */
export async function getMyRecommendations(
  page: number = 0,
  size: number = 10,
  sort: string = "createdAt",
  direction: "ASC" | "DESC" = "DESC"
): Promise<ApiResult<PageResponse<RecommendationGetMyResponse>>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
    direction,
  })

  return apiGet<PageResponse<RecommendationGetMyResponse>>(
    `/v1/recommendations?${params.toString()}`,
    { requiresAuth: true }
  )
}

/**
 * 추천으로부터 판매글 생성
 * ACCEPTED 상태의 판매 추천을 기반으로 판매글을 생성합니다.
 * 
 * @param recommendationId - 판매글을 생성할 추천 ID
 * @param request - 판매글 생성 요청 정보
 * @returns 생성된 판매글 정보
 */
export async function createSalePostFromRecommendation(
  recommendationId: number,
  request: RecommendationSalePostCreateRequest
): Promise<ApiResult<SalePostCreateResponse>> {
  return apiPost<SalePostCreateResponse>(
    `/v1/recommendations/${recommendationId}/sale-posts`,
    request,
    { requiresAuth: true }
  )
}

/**
 * 배치 실행 이력 조회
 * 추천 배치 스케줄러의 실행 이력을 조회합니다.
 * 
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지 크기
 * @param sort - 정렬 기준 필드 (기본값: startTime)
 * @param direction - 정렬 방향 (기본값: DESC)
 * @returns 배치 이력 목록
 */
export async function getBatchHistory(
  page: number = 0,
  size: number = 20,
  sort: string = "startTime",
  direction: "ASC" | "DESC" = "DESC"
): Promise<ApiResult<RecommendationBatchHistoryListResponse>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
    direction,
  })

  return apiGet<RecommendationBatchHistoryListResponse>(
    `/v1/recommendations/batch-history?${params.toString()}`,
    { requiresAuth: true }
  )
}

/**
 * 최근 배치 실행 이력 조회
 * 가장 최근에 실행된 배치의 상세 정보를 조회합니다.
 * 
 * @returns 최근 배치 이력
 */
export async function getLatestBatchHistory(): Promise<
  ApiResult<RecommendationBatchHistoryResponse>
> {
  return apiGet<RecommendationBatchHistoryResponse>(
    "/v1/recommendations/batch-history/latest",
    { requiresAuth: true }
  )
}

/**
 * 기부 추천 수락 후 주변 기부처 검색
 * ACCEPTED 상태의 기부 추천에서 사용자 위치 기반으로 주변 기부처를 검색합니다.
 * 
 * @param recommendationId - 추천 ID
 * @param radius - 검색 반경 (미터, 기본값: 5000m = 5km)
 * @param keyword - 검색 키워드 (선택사항)
 * @returns 거리순으로 정렬된 기부처 목록
 */
export async function searchDonationCentersFromRecommendation(
  recommendationId: number,
  radius?: number,
  keyword?: string
): Promise<ApiResult<DonationCenterSearchResponse[]>> {
  const params = new URLSearchParams()
  
  if (radius !== undefined) {
    params.append("radius", radius.toString())
  }
  
  if (keyword) {
    params.append("keyword", keyword)
  }

  const queryString = params.toString()
  const url = queryString
    ? `/v1/recommendations/${recommendationId}/donation-centers?${queryString}`
    : `/v1/recommendations/${recommendationId}/donation-centers`

  return apiGet<DonationCenterSearchResponse[]>(url, { requiresAuth: true })
}