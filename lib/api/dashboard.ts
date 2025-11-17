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
  // Next.js 프록시를 사용하므로 상대 경로 사용
  const response = await fetch("/api/v1/dashboards/users/overview", {
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
  // Next.js 프록시를 사용하므로 상대 경로 사용
  const response = await fetch("/api/v1/dashboards/users/statistics", {
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
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminUserStatistics] 백엔드 API 미구현 - Mock 데이터 반환")
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      totalUsers: 1250,
      activeUsers: 980,
      inactiveUsers: 270,
      dailyNewUsers: 15,
      weeklyNewUsers: 87,
      monthlyNewUsers: 342,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<AdminUserStatisticsResponse>(`/api/admin/v1/dashboards/users/statistics${params}`, {
    requiresAuth: true
  })
  */
}

/**
 * 관리자 - 옷 통계 조회
 */
export async function getAdminClothesStatistics(): Promise<ApiResult<AdminClothesStatisticsResponse>> {
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminClothesStatistics] 백엔드 API 미구현 - Mock 데이터 반환")
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      totalClothes: 5430,
      publicClothes: 4120,
      privateClothes: 1310,
      averageClothesPerUser: 4.3,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  return apiGet<AdminClothesStatisticsResponse>("/api/admin/v1/dashboards/clothes/statistics", {
    requiresAuth: true
  })
  */
}

/**
 * 관리자 - 판매글 통계 조회
 */
export async function getAdminSalePostStatistics(baseDate?: string): Promise<ApiResult<AdminSalePostStatisticsResponse>> {
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminSalePostStatistics] 백엔드 API 미구현 - Mock 데이터 반환")
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      totalSalePosts: 823,
      activeSalePosts: 456,
      soldSalePosts: 312,
      reservedSalePosts: 55,
      dailyNewSalePosts: 8,
      weeklyNewSalePosts: 47,
      monthlyNewSalePosts: 189,
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<AdminSalePostStatisticsResponse>(`/api/admin/v1/dashboards/sale-posts/statistics${params}`, {
    requiresAuth: true
  })
  */
}

/**
 * 관리자 - 인기 카테고리 통계 조회
 */
export async function getAdminTopCategoryStatistics(): Promise<ApiResult<AdminTopCategoryStatisticsResponse>> {
  // TODO: 백엔드 API 구현 대기 중 - Mock 데이터 사용
  console.warn("[getAdminTopCategoryStatistics] 백엔드 API 미구현 - Mock 데이터 반환")
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  return {
    success: true,
    message: "Mock 데이터 조회 성공",
    data: {
      topCategories: [
        { categoryName: "상의", count: 1245 },
        { categoryName: "하의", count: 987 },
        { categoryName: "아우터", count: 756 },
        { categoryName: "신발", count: 623 },
        { categoryName: "가방", count: 512 },
        { categoryName: "액세서리", count: 489 },
        { categoryName: "원피스", count: 356 },
        { categoryName: "스포츠웨어", count: 234 },
        { categoryName: "언더웨어", count: 189 },
        { categoryName: "잡화", count: 145 },
      ]
    }
  }
  
  /* 백엔드 API 구현 시 사용할 코드
  return apiGet<AdminTopCategoryStatisticsResponse>("/api/admin/v1/dashboards/popular", {
    requiresAuth: true
  })
  */
}

// ==================== 사용자 대시보드 API (새 버전) ====================

/**
 * 사용자 - 옷 분포 현황 조회
 */
export async function getUserDashboardSummary(): Promise<ApiResult<DashboardUserSummaryResponse>> {
  return apiGet<DashboardUserSummaryResponse>("/api/v1/dashboards/users/overview", {
    requiresAuth: true
  })
}

/**
 * 사용자 - 착용 횟수 및 기간 통계 조회
 */
export async function getUserWearStatistics(baseDate?: string): Promise<ApiResult<DashboardUserWearStatisticsResponse>> {
  const params = baseDate ? `?baseDate=${baseDate}` : ""
  return apiGet<DashboardUserWearStatisticsResponse>(`/api/v1/dashboards/users/statistics${params}`, {
    requiresAuth: true
  })
}
