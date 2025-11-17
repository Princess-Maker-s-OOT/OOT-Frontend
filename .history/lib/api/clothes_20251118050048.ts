import {
  CreateClothesRequest,
  CreateClothesSuccessResponse,
  CreateClothesErrorResponse,
  UpdateClothesRequest,
  UpdateClothesSuccessResponse,
  UpdateClothesErrorResponse,
  GetClothesQuery,
  GetClothesSuccessResponse,
  GetClothesErrorResponse,
  GetClothesByIdSuccessResponse,
  GetClothesByIdErrorResponse,
  DeleteClothesSuccessResponse,
  DeleteClothesErrorResponse,
} from "../types/clothes"
import { apiDelete, apiGet, apiPost, apiPut } from "./client"

/**
 * 옷 등록
 */
export async function createClothes(
  data: CreateClothesRequest
): Promise<CreateClothesSuccessResponse | CreateClothesErrorResponse> {
  console.log("=== createClothes API 요청 ===")
  console.log("요청 데이터:", JSON.stringify(data, null, 2))

  // 백엔드에서 images만 허용하므로 imageIds 필드 제거
  const result = await apiPost<CreateClothesSuccessResponse["data"]>(
    "/api/v1/clothes",
    data,
    { requiresAuth: true }
  )

  console.log("=== createClothes API 응답 ===")
  console.log("응답 결과:", JSON.stringify(result, null, 2))

  if (result.success && result.data) {
    return {
      httpStatus: "CREATED",
      statusValue: 201,
      success: true,
      code: "CLOTHES_CREATED",
      message: result.message || "옷이 등록되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as CreateClothesSuccessResponse
  }

  return {
    httpStatus: "BAD_REQUEST",
    statusValue: 400,
    success: false,
    code: "VALIDATION_ERROR",
    message: result.message || "옷 등록 실패",
    timestamp: new Date().toISOString()
  } as CreateClothesErrorResponse
}

/**
 * 옷 리스트 조회
 */
export async function getClothes(
  query: GetClothesQuery = {}
): Promise<GetClothesSuccessResponse | GetClothesErrorResponse> {
  const params = new URLSearchParams()
  if (query.categoryId !== undefined) params.append("categoryId", query.categoryId.toString())
  if (query.clothesColor) params.append("clothesColor", query.clothesColor)
  if (query.clothesSize) params.append("clothesSize", query.clothesSize)
  if (query.lastClothesId !== undefined) params.append("lastClothesId", query.lastClothesId.toString())
  if (query.page !== undefined) params.append("page", query.page.toString())
  if (query.size !== undefined) params.append("size", query.size.toString())

  const result = await apiGet<GetClothesSuccessResponse["data"]>(
    `/api/v1/clothes?${params.toString()}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOTHES_GET_OK",
      message: result.message || "옷 목록을 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetClothesSuccessResponse
  }

  return {
    httpStatus: "OK",
    statusValue: 200,
    success: true,
    code: "CLOTHES_GET_OK",
    message: "옷 목록을 조회했습니다.",
    timestamp: new Date().toISOString(),
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: query.size || 10,
      number: query.page || 0
    }
  } as GetClothesSuccessResponse
}

/**
 * 옷 상세 조회
 */
export async function getClothesById(
  clothesId: number
): Promise<GetClothesByIdSuccessResponse | GetClothesByIdErrorResponse> {
  const result = await apiGet<GetClothesByIdSuccessResponse["data"]>(
    `/api/v1/clothes/${clothesId}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOTHES_GET_OK",
      message: result.message || "옷 상세 정보를 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetClothesByIdSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOTHES_NOT_FOUND",
    message: result.message || "옷을 찾을 수 없습니다.",
    timestamp: new Date().toISOString()
  } as GetClothesByIdErrorResponse
}

/**
 * 옷 수정
 */
export async function updateClothes(
  clothesId: number,
  data: UpdateClothesRequest
): Promise<UpdateClothesSuccessResponse | UpdateClothesErrorResponse> {
  const result = await apiPut<UpdateClothesSuccessResponse["data"]>(
    `/api/v1/clothes/${clothesId}`,
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOTHES_UPDATE_OK",
      message: result.message || "옷 정보가 수정되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as UpdateClothesSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOTHES_NOT_FOUND",
    message: result.message || "옷 수정 실패",
    timestamp: new Date().toISOString()
  } as UpdateClothesErrorResponse
}

/**
 * 옷 삭제
 */
export async function deleteClothes(
  clothesId: number
): Promise<DeleteClothesSuccessResponse | DeleteClothesErrorResponse> {
  const result = await apiDelete<DeleteClothesSuccessResponse["data"]>(
    `/api/v1/clothes/${clothesId}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOTHES_DELETE_OK",
      message: result.message || "옷이 삭제되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as DeleteClothesSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOTHES_NOT_FOUND",
    message: result.message || "옷 삭제 실패",
    timestamp: new Date().toISOString()
  } as DeleteClothesErrorResponse
}