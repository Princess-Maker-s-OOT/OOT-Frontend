import type {
  UpdateSalePostStatusRequest,
  UpdateSalePostStatusSuccessResponse,
  UpdateSalePostStatusErrorResponse,
} from "@/lib/types/sale-post"

export async function updateSalePostStatus(
  salePostId: number,
  data: UpdateSalePostStatusRequest,
  accessToken: string
): Promise<UpdateSalePostStatusSuccessResponse | UpdateSalePostStatusErrorResponse> {
  const response = await fetch(
    `http://localhost/api/v1/sale-posts/${salePostId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  )

  const result = await response.json()
  return result
}

/**
 * 판매글을 추천에서 생성 (간단한 wrapper)
 */
export async function createSalePostFromRecommendation(
  recommendationId: number,
  data: any,
  accessToken?: string
): Promise<any> {
  if (!accessToken) {
    return {
      httpStatus: "UNAUTHORIZED",
      statusValue: 401,
      success: false,
      code: "UNAUTHORIZED",
      message: "로그인이 필요한 기능입니다.",
      timestamp: new Date().toISOString(),
    }
  }

  const res = await fetch(
    `http://localhost/api/v1/recommendations/${recommendationId}/sale-post`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  )

  return await res.json()
}