import { apiGet } from "./client"
import type { ApiResult } from "./client"
import type {
  GetUserClothesOverviewSuccessResponse,
  GetUserClothesOverviewErrorResponse,
  GetWearStatisticsSuccessResponse,
  GetWearStatisticsErrorResponse,
  AdminUserStatisticsResponse,
  AdminClothesStatisticsResponse,
  AdminSalePostStatisticsResponse,
  AdminTopCategoryStatisticsResponse,
  DashboardUserSummaryResponse,
  DashboardUserWearStatisticsResponse
} from "@/lib/types/dashboard"

// ==================== 기존 API (호환성 유지) ====================

export async function getUserClothesOverview(
  accessToken: string
): Promise<GetUserClothesOverviewSuccessResponse | GetUserClothesOverviewErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/dashboards/users/overview", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

export async function getWearStatistics(
  accessToken: string
): Promise<GetWearStatisticsSuccessResponse | GetWearStatisticsErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/dashboards/users/statistics", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

// ==================== 관리자 대시보드 API ====================

/**
 * 관리자 - 사용자 통계 조회
 */
export async function getAdminUserStatistics(baseDate?: string): Promise<ApiResult<AdminUserStatisticsResponse>> {
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<AdminUserStatisticsResponse>(`/admin/v1/dashboards/users/statistics${params}`, {
    requiresAuth: true
  })
}

/**
 * 관리자 - 옷 통계 조회
 */
export async function getAdminClothesStatistics(): Promise<ApiResult<AdminClothesStatisticsResponse>> {
  return apiGet<AdminClothesStatisticsResponse>("/admin/v1/dashboards/clothes/statistics", {
    requiresAuth: true
  })
}

/**
 * 관리자 - 판매글 통계 조회
 */
export async function getAdminSalePostStatistics(baseDate?: string): Promise<ApiResult<AdminSalePostStatisticsResponse>> {
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<AdminSalePostStatisticsResponse>(`/admin/v1/dashboards/sale-posts/statistics${params}`, {
    requiresAuth: true
  })
}

/**
 * 관리자 - 인기 카테고리 통계 조회
 */
export async function getAdminTopCategoryStatistics(): Promise<ApiResult<AdminTopCategoryStatisticsResponse>> {
  return apiGet<AdminTopCategoryStatisticsResponse>("/admin/v1/dashboards/popular", {
    requiresAuth: true
  })
}

// ==================== 사용자 대시보드 API (새 버전) ====================

/**
 * 사용자 - 옷 분포 현황 조회
 */
export async function getUserDashboardSummary(): Promise<ApiResult<DashboardUserSummaryResponse>> {
  return apiGet<DashboardUserSummaryResponse>("/v1/dashboards/users/overview", {
    requiresAuth: true
  })
}

/**
 * 사용자 - 착용 횟수 및 기간 통계 조회
 */
export async function getUserWearStatistics(baseDate?: string): Promise<ApiResult<DashboardUserWearStatisticsResponse>> {
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<DashboardUserWearStatisticsResponse>(`/v1/dashboards/users/statistics${params}`, {
    requiresAuth: true
  })
}
