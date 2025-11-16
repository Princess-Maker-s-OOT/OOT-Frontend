import type {
  GetUserStatisticsSuccessResponse,
  GetUserStatisticsErrorResponse,
  GetClothesStatisticsSuccessResponse,
  GetClothesStatisticsErrorResponse,
  GetSalePostStatisticsSuccessResponse,
  GetSalePostStatisticsErrorResponse,
  GetPopularCategoryStatisticsSuccessResponse,
  GetPopularCategoryStatisticsErrorResponse,
} from "@/lib/types/admin"

import { apiGet } from "./client"

export async function getUserStatistics(
  accessToken: string
): Promise<GetUserStatisticsSuccessResponse | GetUserStatisticsErrorResponse> {
  const result = await apiGet<any>(
    "/api/admin/v1/dashboards/users/statistics",
    { requiresAuth: true }
  )
  return result as any
}

export async function getClothesStatistics(
  accessToken: string
): Promise<GetClothesStatisticsSuccessResponse | GetClothesStatisticsErrorResponse> {
  const result = await apiGet<any>(
    "/api/admin/v1/dashboards/clothes/statistics",
    { requiresAuth: true }
  )
  return result as any
}

export async function getSalePostStatistics(
  accessToken: string
): Promise<GetSalePostStatisticsSuccessResponse | GetSalePostStatisticsErrorResponse> {
  const result = await apiGet<any>(
    "/api/admin/v1/dashboards/sale-posts/statistics",
    { requiresAuth: true }
  )
  return result as any
}

export async function getPopularCategoryStatistics(
  accessToken: string
): Promise<GetPopularCategoryStatisticsSuccessResponse | GetPopularCategoryStatisticsErrorResponse> {
  const result = await apiGet<any>(
    "/api/admin/v1/dashboards/popular",
    { requiresAuth: true }
  )
  return result as any
}