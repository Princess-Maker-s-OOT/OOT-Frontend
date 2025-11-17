import { apiGet, apiPost } from "./client"
import type { ApiResult } from "./client"
import type { PaginatedResponse } from "../types/common"
import type {
  CreateWearRecordRequest,
  WearRecordCreateResponse,
  WearRecordGetMyResponse,
} from "@/lib/types/wear-record"

/**
 * 착용 기록 등록
 * 사용자가 특정 옷을 착용했음을 기록하고, 해당 옷의 마지막 착용 일시를 업데이트합니다.
 * 
 * @param request - 착용 기록 등록 요청 (clothesId 포함)
 * @returns 등록된 기록 ID
 */
export async function createWearRecord(
  request: CreateWearRecordRequest
): Promise<ApiResult<WearRecordCreateResponse>> {
  return apiPost<WearRecordCreateResponse>("/v1/wear-records", request, {
    requiresAuth: true,
  })
}

/**
 * 내 착용 기록 리스트 조회
 * 로그인한 사용자의 전체 착용 기록을 최신순(wornAt DESC)으로 페이징하여 조회합니다.
 * 
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지 크기
 * @param sort - 정렬 기준 필드 (기본값: wornAt)
 * @param direction - 정렬 방향 (기본값: DESC)
 * @returns 착용 기록 페이지 응답
 */
export async function getMyWearRecords(
  page: number = 0,
  size: number = 10,
  sort: string = "wornAt",
  direction: "ASC" | "DESC" = "DESC"
): Promise<ApiResult<PaginatedResponse<WearRecordGetMyResponse>>> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort,
    direction,
  })

  return apiGet<PaginatedResponse<WearRecordGetMyResponse>>(
    `/v1/wear-records?${params.toString()}`,
    { requiresAuth: true }
  )
}