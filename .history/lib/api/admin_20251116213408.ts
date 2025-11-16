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

export async function getUserStatistics(
  accessToken: string
): Promise<GetUserStatisticsSuccessResponse | GetUserStatisticsErrorResponse> {
  const response = await fetch("/api/admin/v1/dashboards/users/statistics", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

export async function getClothesStatistics(
  accessToken: string
): Promise<GetClothesStatisticsSuccessResponse | GetClothesStatisticsErrorResponse> {
  const response = await fetch("/api/admin/v1/dashboards/clothes/statistics", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

export async function getSalePostStatistics(
  accessToken: string
): Promise<GetSalePostStatisticsSuccessResponse | GetSalePostStatisticsErrorResponse> {
  const response = await fetch("/api/admin/v1/dashboards/sale-posts/statistics", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

export async function getPopularCategoryStatistics(
  accessToken: string
): Promise<GetPopularCategoryStatisticsSuccessResponse | GetPopularCategoryStatisticsErrorResponse> {
  const response = await fetch("/api/admin/v1/dashboards/popular", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}