import { ApiSuccessResponse, ApiErrorResponse, PaginationQuery } from "./common"

export interface CreateClothesRequest {
  categoryId: number
  clothesSize: string
  clothesColor: string
  description: string
  images: number[] // 이미지 ID 배열
}

export interface UpdateClothesRequest {
  categoryId: number
  clothesSize: string
  clothesColor: string
  description: string
  images: number[] // 이미지 ID 배열
}

export interface ClothesImage {
  imageId: number
  imageUrl: string
  isMain: boolean
}

export interface ClothesItem {
  id: number
  categoryId: number
  userId: number
  clothesSize: string
  clothesColor: string
  description: string
  clothesImages: ClothesImage[]
}

export interface GetClothesQuery extends PaginationQuery {
  categoryId?: number
  clothesColor?: string
  clothesSize?: string
  lastClothesId?: number
  size?: number
}

export interface GetClothesSuccessResponse extends ApiSuccessResponse<{
  content: ClothesItem[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}> {
  code: "CLOTHES_GET_OK"
}

export interface GetClothesErrorResponse extends ApiErrorResponse {
  code: "VALIDATION_ERROR" | "NETWORK_ERROR"
  httpStatus: "BAD_REQUEST"
  statusValue: 400
}

export interface GetClothesByIdSuccessResponse extends ApiSuccessResponse<ClothesItem> {
  code: "CLOTHES_GET_OK"
}

export interface GetClothesByIdErrorResponse extends ApiErrorResponse {
  code: "CLOTHES_FORBIDDEN" | "CLOTHES_NOT_FOUND"
  httpStatus: "FORBIDDEN" | "NOT_FOUND"
  statusValue: 403 | 404
}

export interface CreateClothesSuccessResponse extends ApiSuccessResponse<ClothesItem> {
  code: "CLOTHES_CREATED"
  httpStatus: "CREATED"
  statusValue: 201
}

export interface CreateClothesErrorResponse extends ApiErrorResponse {
  code: "VALIDATION_ERROR"
  httpStatus: "BAD_REQUEST"
  statusValue: 400
}

export interface UpdateClothesSuccessResponse extends ApiSuccessResponse<ClothesItem> {
  code: "CLOTHES_UPDATE_OK"
}

export interface UpdateClothesErrorResponse extends ApiErrorResponse {
  code: "VALIDATION_ERROR" | "UNEXPECTED_SERVER_ERROR" | "CLOTHES_NOT_FOUND"
  httpStatus: "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_FOUND"
  statusValue: 400 | 500
}

export interface DeleteClothesSuccessResponse extends ApiSuccessResponse<void> {
  code: "CLOTHES_DELETE"
}

export interface DeleteClothesErrorResponse extends ApiErrorResponse {
  code: "CLOTHES_FORBIDDEN" | "CLOTHES_NOT_FOUND"
  httpStatus: "FORBIDDEN" | "NOT_FOUND"
  statusValue: 403 | 404
}