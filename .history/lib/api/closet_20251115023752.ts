import { apiGet, apiPost, apiPut, apiDelete } from "./client"
import type {
  CreateClosetRequest,
  CreateClosetSuccessResponse,
  CreateClosetErrorResponse,
  GetPublicClosetsQuery,
  GetPublicClosetsSuccessResponse,
  GetClosetByIdSuccessResponse,
  GetClosetByIdErrorResponse,
  GetMyClosetsSuccessResponse,
  UpdateClosetRequest,
  UpdateClosetSuccessResponse,
  UpdateClosetErrorResponse,
  DeleteClosetSuccessResponse,
  DeleteClosetErrorResponse,
  LinkClothesToClosetRequest,
  LinkClothesToClosetSuccessResponse,
  LinkClothesToClosetErrorResponse,
  GetClosetClothesSuccessResponse,
  GetClosetClothesErrorResponse,
  RemoveClothesFromClosetSuccessResponse,
  RemoveClothesFromClosetErrorResponse,
  ClosetItem,
} from "@/lib/types/closet"

/**
 * 옷장 생성
 */
export async function createCloset(
  data: CreateClosetRequest
): Promise<CreateClosetSuccessResponse | CreateClosetErrorResponse> {
  const result = await apiPost<CreateClosetSuccessResponse["data"]>(
    "/api/v1/closets",
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "CREATED",
      statusValue: 201,
      success: true,
      code: "CLOSET_CREATED",
      message: result.message || "옷장이 등록되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as CreateClosetSuccessResponse
  }

  return {
    httpStatus: "BAD_REQUEST",
    statusValue: 400,
    success: false,
    code: "VALIDATION_ERROR",
    message: result.message || "옷장 생성 실패",
    timestamp: new Date().toISOString()
  } as CreateClosetErrorResponse
}

/**
 * 공개 옷장 목록 조회 (비회원 접근 가능)
 */
export async function getPublicClosets(
  query: GetPublicClosetsQuery = {}
): Promise<GetPublicClosetsSuccessResponse> {
  const params = new URLSearchParams()
  if (query.page !== undefined) params.append("page", query.page.toString())
  if (query.size !== undefined) params.append("size", query.size.toString())
  if (query.sort) params.append("sort", query.sort)
  if (query.direction) params.append("direction", query.direction)

  const result = await apiGet<{ content: ClosetItem[], totalElements: number, totalPages: number, size: number, number: number }>(
    `/api/v1/closets/public?${params.toString()}`,
    { requiresAuth: false }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSETS_GET_PUBLIC_OK",
      message: result.message || "공개 옷장 리스트를 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetPublicClosetsSuccessResponse
  }

  return {
    httpStatus: "OK",
    statusValue: 200,
    success: true,
    code: "CLOSETS_GET_PUBLIC_OK",
    message: "공개 옷장 리스트를 조회했습니다.",
    timestamp: new Date().toISOString(),
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: query.size || 10,
      number: query.page || 0
    }
  } as GetPublicClosetsSuccessResponse
}

/**
 * 옷장 상세 조회
 */
export async function getClosetById(
  closetId: number
): Promise<GetClosetByIdSuccessResponse | GetClosetByIdErrorResponse> {
  const result = await apiGet<GetClosetByIdSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}`,
    { requiresAuth: false }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSET_GET_OK",
      message: result.message || "옷장 상세 정보를 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetClosetByIdSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOSET_NOT_FOUND",
    message: result.message || "옷장을 찾을 수 없습니다.",
    data: null,
    timestamp: new Date().toISOString()
  } as GetClosetByIdErrorResponse
}

/**
 * 내 옷장 목록 조회
 */
export async function getMyClosets(
  query: GetPublicClosetsQuery = {}
): Promise<GetMyClosetsSuccessResponse> {
  const params = new URLSearchParams()
  if (query.page !== undefined) params.append("page", query.page.toString())
  if (query.size !== undefined) params.append("size", query.size.toString())
  if (query.sort) params.append("sort", query.sort)
  if (query.direction) params.append("direction", query.direction)

  const result = await apiGet<GetMyClosetsSuccessResponse["data"]>(
    `/api/v1/closets/me?${params.toString()}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSETS_GET_MY_OK",
      message: result.message || "내 옷장 리스트를 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetMyClosetsSuccessResponse
  }

  return {
    httpStatus: "OK",
    statusValue: 200,
    success: true,
    code: "CLOSETS_GET_MY_OK",
    message: "내 옷장 리스트를 조회했습니다.",
    timestamp: new Date().toISOString(),
    data: {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: query.size || 10,
      number: query.page || 0
    }
  } as GetMyClosetsSuccessResponse
}

/**
 * 옷장 수정
 */
export async function updateCloset(
  closetId: number,
  data: UpdateClosetRequest
): Promise<UpdateClosetSuccessResponse | UpdateClosetErrorResponse> {
  const result = await apiPut<UpdateClosetSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}`,
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSET_UPDATE_OK",
      message: result.message || "옷장 정보가 수정되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as UpdateClosetSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOSET_NOT_FOUND",
    message: result.message || "옷장 수정 실패",
    timestamp: new Date().toISOString()
  } as UpdateClosetErrorResponse
}

/**
 * 옷장 삭제
 */
export async function deleteCloset(
  closetId: number
): Promise<DeleteClosetSuccessResponse | DeleteClosetErrorResponse> {
  const result = await apiDelete<DeleteClosetSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSET_DELETE_OK",
      message: result.message || "옷장이 삭제되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as DeleteClosetSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOSET_NOT_FOUND",
    message: result.message || "옷장 삭제 실패",
    data: null,
    timestamp: new Date().toISOString()
  } as DeleteClosetErrorResponse
}

/**
 * 옷장에 옷 추가
 */
export async function linkClothesToCloset(
  closetId: number,
  data: LinkClothesToClosetRequest
): Promise<LinkClothesToClosetSuccessResponse | LinkClothesToClosetErrorResponse> {
  const result = await apiPost<LinkClothesToClosetSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}/clothes`,
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "CREATED",
      statusValue: 201,
      success: true,
      code: "CLOSET_CLOTHES_LINKED",
      message: result.message || "옷장에 옷이 등록되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as LinkClothesToClosetSuccessResponse
  }

  return {
    httpStatus: "BAD_REQUEST",
    statusValue: 400,
    success: false,
    code: "CLOTHES_ALREADY_LINKED",
    message: result.message || "옷 추가 실패",
    data: null,
    timestamp: new Date().toISOString()
  } as LinkClothesToClosetErrorResponse
}

/**
 * 옷장의 옷 목록 조회
 */
export async function getClosetClothes(
  closetId: number,
  query: GetPublicClosetsQuery = {}
): Promise<GetClosetClothesSuccessResponse | GetClosetClothesErrorResponse> {
  const params = new URLSearchParams()
  if (query.page !== undefined) params.append("page", query.page.toString())
  if (query.size !== undefined) params.append("size", query.size.toString())
  if (query.sort) params.append("sort", query.sort)
  if (query.direction) params.append("direction", query.direction)

  const result = await apiGet<GetClosetClothesSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}/clothes?${params.toString()}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSET_CLOTHES_LIST_OK",
      message: result.message || "옷장에 등록된 옷 리스트를 조회했습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetClosetClothesSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOSET_NOT_FOUND",
    message: result.message || "옷장을 찾을 수 없습니다.",
    data: null,
    timestamp: new Date().toISOString()
  } as GetClosetClothesErrorResponse
}

/**
 * 옷장에서 옷 제거
 */
export async function removeClothesFromCloset(
  closetId: number,
  clothesId: number
): Promise<RemoveClothesFromClosetSuccessResponse | RemoveClothesFromClosetErrorResponse> {
  const result = await apiDelete<RemoveClothesFromClosetSuccessResponse["data"]>(
    `/api/v1/closets/${closetId}/clothes/${clothesId}`,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "CLOSET_CLOTHES_DELETED",
      message: result.message || "옷장에서 옷이 제거되었습니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as RemoveClothesFromClosetSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "CLOTHES_NOT_LINKED",
    message: result.message || "옷 제거 실패",
    data: null,
    timestamp: new Date().toISOString()
  } as RemoveClothesFromClosetErrorResponse
}