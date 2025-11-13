import type {
  GetUserClothesOverviewSuccessResponse,
  GetUserClothesOverviewErrorResponse,
  GetWearStatisticsSuccessResponse,
  GetWearStatisticsErrorResponse,
} from "@/lib/types/dashboard"

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