import { ApiSuccessResponse, ApiErrorResponse } from "./common"

export interface VerifyPasswordRequest {
  password: string
}

export interface UpdateMyInfoRequest {
  email?: string | null
  nickname?: string | null
  username?: string | null
  phoneNumber?: string | null
  tradeAddress?: string
  tradeLatitude?: number
  tradeLongitude?: number
}

export interface UpdateProfileImageRequest {
  imageId: number
}

export interface UserProfile {
  imageUrl: string | null
  loginId: string
  email: string
  nickname: string
  username: string
  phoneNumber: string | null
  tradeAddress: string
  tradeLatitude: number
  tradeLongitude: number
  loginType: "LOGIN_ID" | "SOCIAL"
  socialProvider: "GOOGLE" | "KAKAO" | "NAVER" | null
  role?: "USER" | "ADMIN" // 사용자 역할 추가
}

export interface GetMyInfoSuccessResponse extends ApiSuccessResponse<UserProfile> {
}

export interface GetMyInfoErrorResponse extends ApiErrorResponse {
  httpStatus: "UNAUTHORIZED" | string
  statusValue: 401 | number
  success: false
  code: "UNAUTHORIZED" | string
  message: string
  timestamp: string
}

export interface VerifyPasswordSuccessResponse extends ApiSuccessResponse<null> {
  code: "PASSWORD_VERIFIED"
}

export interface VerifyPasswordErrorResponse extends ApiErrorResponse {
  httpStatus: "UNAUTHORIZED" | string
  statusValue: 401 | number
  success: false
  code: "INVALID_PASSWORD" | string
  message: string
  timestamp: string
}

export interface UpdateMyInfoSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "UPDATE_MY_INFO"
  message: string
  timestamp: string
  data: {
    email: string
    nickname: string
    username: string
    phoneNumber: string
  }
}

export interface UpdateMyInfoErrorResponse extends ApiErrorResponse {
  httpStatus: "BAD_REQUEST" | "UNAUTHORIZED" | string
  statusValue: 400 | 401 | number
  success: false
  code: "VALIDATION_ERROR" | string
  message: string
  timestamp: string
}

export interface UpdateProfileImageSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "UPDATE_MY_PROFILE_IMAGE"
  message: string
  timestamp: string
  data: {
    userId: number
    imageUrl: string
  }
}

export interface UpdateProfileImageErrorResponse extends ApiErrorResponse {
  httpStatus: "NOT_FOUND" | "UNAUTHORIZED" | string
  statusValue: 404 | 401 | number
  success: false
  code: "IMAGE_NOT_FOUND" | string
  message: string
  timestamp: string
}

export interface DeleteProfileImageSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DELETE_PROFILE_IMAGE"
  message: string
  timestamp: string
}

export interface DeleteProfileImageErrorResponse extends ApiErrorResponse {
  httpStatus: "NOT_FOUND" | "UNAUTHORIZED" | string
  statusValue: 404 | 401 | number
  success: false
  code: "PROFILE_IMAGE_NOT_FOUND" | string
  message: string
  timestamp: string
}