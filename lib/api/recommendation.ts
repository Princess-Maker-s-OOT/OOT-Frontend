import type {
  CreateRecommendationSuccessResponse,
  CreateRecommendationErrorResponse,
  GetRecommendationsSuccessResponse,
  GetRecommendationsErrorResponse,
} from "@/lib/types/recommendation"

export async function createRecommendation(
  accessToken: string
): Promise<CreateRecommendationSuccessResponse | CreateRecommendationErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}

export async function getRecommendations(
  accessToken: string
): Promise<GetRecommendationsSuccessResponse | GetRecommendationsErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/recommendations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}