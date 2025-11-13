export interface RecommendationItem {
  recommendationId: number
  userId: number
  clothesId: number
  clothesName?: string
  clothesImageUrl?: string
  type: "DONATION" | "SALE"
  reason: string
  status: "PENDING" | "ACCEPTED" | "REJECTED"
  createdAt: string
  updatedAt: string
}

export interface CreateRecommendationSuccessResponse {
  httpStatus: "CREATED"
  statusValue: 201
  success: true
  code: "RECOMMENDATION_CREATED"
  message: string
  timestamp: string
  data: RecommendationItem[]
}

export interface CreateRecommendationErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

export interface GetRecommendationsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "RECOMMENDATION_GET_OK"
  message: string
  timestamp: string
  data: {
    content: RecommendationItem[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export interface GetRecommendationsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}