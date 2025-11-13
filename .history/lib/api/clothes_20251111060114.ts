import { API_CONFIG } from "../config"
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
import { apiDelete, apiGet, apiPost, apiPut, createQueryString } from "./utils"

import { MOCK_CLOTHES, createMockResponse } from "../mocks"

/**
 * 옷 등록
 */
export async function createClothes(
  data: CreateClothesRequest,
  accessToken: string
): Promise<CreateClothesSuccessResponse | CreateClothesErrorResponse> {
  return await apiPost<CreateClothesSuccessResponse, CreateClothesErrorResponse>(
    API_CONFIG.ENDPOINTS.CLOTHES.BASE,
    data,
    { accessToken }
  )
}

/**
 * 옷 리스트 조회
 */
export async function getClothes(
  query: GetClothesQuery,
  accessToken?: string
): Promise<GetClothesSuccessResponse | GetClothesErrorResponse> {
  // 로그인하지 않은 경우 mock 데이터 반환
  if (!accessToken) {
    const content = MOCK_CLOTHES
    return createMockResponse({
      content,
      totalElements: content.length,
      totalPages: 1,
      size: content.length,
      number: 0,
    })
  }

  const queryString = createQueryString(query)
  return await apiGet<GetClothesSuccessResponse, GetClothesErrorResponse>(
    `${API_CONFIG.ENDPOINTS.CLOTHES.BASE}${queryString}`,
    { accessToken }
  )
}

/**
 * 옷 상세 조회
 */
export async function getClothesById(
  clothesId: number,
  accessToken?: string
): Promise<GetClothesByIdSuccessResponse | GetClothesByIdErrorResponse> {
  // 로그인하지 않은 경우 mock 데이터 반환
  if (!accessToken) {
    const mockItem = MOCK_CLOTHES.find((item) => item.clothesId === clothesId)
    if (!mockItem) {
      return {
        httpStatus: "NOT_FOUND",
        statusValue: 404,
        success: false,
        code: "CLOTHES_NOT_FOUND",
        message: "옷을 찾을 수 없습니다.",
        timestamp: new Date().toISOString(),
      }
    }
    return createMockResponse(mockItem)
  }

  return await apiGet<GetClothesByIdSuccessResponse, GetClothesByIdErrorResponse>(
    API_CONFIG.ENDPOINTS.CLOTHES.DETAIL(clothesId),
    { accessToken }
  )
}

/**
 * 옷 수정
 */
export async function updateClothes(
  clothesId: number,
  data: UpdateClothesRequest,
  accessToken: string
): Promise<UpdateClothesSuccessResponse | UpdateClothesErrorResponse> {
  return await apiPut<UpdateClothesSuccessResponse, UpdateClothesErrorResponse>(
    API_CONFIG.ENDPOINTS.CLOTHES.DETAIL(clothesId),
    data,
    { accessToken }
  )
}

/**
 * 옷 삭제
 */
export async function deleteClothes(
  clothesId: number,
  accessToken: string
): Promise<DeleteClothesSuccessResponse | DeleteClothesErrorResponse> {
  return await apiDelete<DeleteClothesSuccessResponse, DeleteClothesErrorResponse>(
    API_CONFIG.ENDPOINTS.CLOTHES.DETAIL(clothesId),
    { accessToken }
  )
}