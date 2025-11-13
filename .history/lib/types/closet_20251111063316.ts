export interface CreateClosetRequest {
  name: string
  description: string
  imageId: number
  isPublic: boolean
}

export interface UpdateClosetRequest {
  name: string
  description: string
  imageId: number
  isPublic: boolean
}

export interface LinkClothesToClosetRequest {
  clothesId: number
}

export interface CreateClosetSuccessResponse {
  httpStatus: "CREATED"
  statusValue: 201
  success: true
  code: "CLOSET_CREATED"
  message: string
  timestamp: string
  data: ClosetDetailData
}

export interface CreateClosetErrorResponse {
  httpStatus: "BAD_REQUEST" | "NOT_FOUND" | "INTERNAL_SERVER_ERROR"
  statusValue: 400 | 404 | 500
  success: false
  code: "VALIDATION_ERROR" | "IMAGE_NOT_FOUND" | "UNEXPECTED_SERVER_ERROR"
  message: string
  data?: string | null
  timestamp: string
}

export interface ClosetItem {
  closetId: number
  name: string
  description: string
  imageUrl: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface GetPublicClosetsQuery {
  page?: number
  size?: number
  sort?: string
  direction?: "ASC" | "DESC"
}

export interface GetPublicClosetsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSETS_GET_PUBLIC_OK"
  message: string
  timestamp: string
  data: {
    content: ClosetItem[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export interface ClosetDetailData {
  closetId: number
  name: string
  description: string
  imageUrl: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface GetClosetByIdSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSET_GET_OK"
  message: string
  timestamp: string
  data: ClosetDetailData
}

export interface GetClosetByIdErrorResponse {
  httpStatus: "NOT_FOUND"
  statusValue: 404
  success: false
  code: "CLOSET_NOT_FOUND"
  message: string
  data: null
  timestamp: string
}

export interface GetMyClosetsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSETS_GET_MY_OK"
  message: string
  timestamp: string
  data: {
    content: ClosetItem[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export interface UpdateClosetSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSET_UPDATE_OK"
  message: string
  timestamp: string
  data: {
    closetId: number
    name: string
    description: string
    imageUrl: string
    isPublic: boolean
    updatedAt: string
  }
}

export interface UpdateClosetErrorResponse {
  httpStatus?: "NOT_FOUND" | "INTERNAL_SERVER_ERROR"
  statusValue?: 404 | 500
  success?: false
  code?: "CLOSET_NOT_FOUND" | "UNEXPECTED_SERVER_ERROR"
  message: string
  data?: null
  timestamp?: string
  status?: "UNAUTHORIZED"
}

export interface DeleteClosetSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSET_DELETE_OK"
  message: string
  timestamp: string
  data: {
    closetId: number
    deletedAt: string
  }
}

export interface DeleteClosetErrorResponse {
  httpStatus: "NOT_FOUND"
  statusValue: 404
  success: false
  code: "CLOSET_NOT_FOUND"
  message: string
  data: null
  timestamp: string
}

export interface LinkClothesToClosetSuccessResponse {
  httpStatus: "CREATED"
  statusValue: 201
  success: true
  code: "CLOSET_CLOTHES_LINKED"
  message: string
  timestamp: string
  data: {
    linkId: number
    closetId: number
    clothesId: number
  }
}

export interface LinkClothesToClosetErrorResponse {
  httpStatus: "BAD_REQUEST" | "NOT_FOUND"
  statusValue: 400 | 404
  success: false
  code: "CLOTHES_ALREADY_LINKED" | "CLOTHES_NOT_FOUND" | "CLOSET_NOT_FOUND"
  message: string
  data: null
  timestamp: string
}

export interface ClosetClothesItem {
  linkId: number
  clothesId: number
  categoryId: number
  clothesSize: string
  clothesColor: string
  description: string
}

export interface GetClosetClothesSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSET_CLOTHES_LIST_OK"
  message: string
  timestamp: string
  data: {
    content: ClosetClothesItem[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export interface GetClosetClothesErrorResponse {
  httpStatus: "NOT_FOUND"
  statusValue: 404
  success: false
  code: "CLOSET_NOT_FOUND"
  message: string
  data: null
  timestamp: string
}

export interface RemoveClothesFromClosetSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "CLOSET_CLOTHES_DELETED"
  message: string
  timestamp: string
  data: {
    closetId: number
    clothesId: number
  }
}

export interface RemoveClothesFromClosetErrorResponse {
  httpStatus: "NOT_FOUND"
  statusValue: 404
  success: false
  code: "CLOSET_NOT_FOUND" | "CLOTHES_NOT_LINKED"
  message: string
  data: null
  timestamp: string
}