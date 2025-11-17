import {
  GetMyInfoSuccessResponse,
  GetMyInfoErrorResponse,
  VerifyPasswordRequest,
  VerifyPasswordSuccessResponse,
  VerifyPasswordErrorResponse,
  UpdateMyInfoRequest,
  UpdateMyInfoSuccessResponse,
  UpdateMyInfoErrorResponse,
  UpdateProfileImageRequest,
  UpdateProfileImageSuccessResponse,
  UpdateProfileImageErrorResponse,
  DeleteProfileImageSuccessResponse,
  DeleteProfileImageErrorResponse,
} from "@/lib/types/user"

import { apiGet, apiPatch, apiPost, apiPut, apiDelete } from "./client"

/**
 * 내 정보 조회
 */
export async function getMyInfo(): Promise<GetMyInfoSuccessResponse | GetMyInfoErrorResponse> {
  const result = await apiGet<GetMyInfoSuccessResponse["data"]>(
    "/api/v1/user/me",
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "GET_MY_INFO",
      message: "회원정보 조회 완료입니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as GetMyInfoSuccessResponse
  }

  return {
    httpStatus: "UNAUTHORIZED",
    statusValue: 401,
    success: false,
    code: "UNAUTHORIZED",
    message: result.message || "인증에 실패했습니다.",
    timestamp: new Date().toISOString()
  } as GetMyInfoErrorResponse
}

/**
 * 비밀번호 확인
 */
export async function verifyPassword(
  data: VerifyPasswordRequest
): Promise<VerifyPasswordSuccessResponse | VerifyPasswordErrorResponse> {
  const result = await apiPost<null>(
    "/api/v1/user/me/password-verification",
    data,
    { requiresAuth: true }
  )

  if (result.success) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "PASSWORD_VERIFIED",
      message: "인증이 완료되었습니다.",
      timestamp: new Date().toISOString(),
      data: null
    } as VerifyPasswordSuccessResponse
  }

  return {
    httpStatus: "UNAUTHORIZED",
    statusValue: 401,
    success: false,
    code: "INVALID_PASSWORD",
    message: result.message || "비밀번호가 일치하지 않습니다.",
    timestamp: new Date().toISOString()
  } as VerifyPasswordErrorResponse
}

/**
 * 내 정보 수정
 */
export async function updateMyInfo(
  data: UpdateMyInfoRequest
): Promise<UpdateMyInfoSuccessResponse | UpdateMyInfoErrorResponse> {
  const result = await apiPatch<UpdateMyInfoSuccessResponse["data"]>(
    "/api/v1/user/me",
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
        code: "UPDATE_MY_INFO",
      message: "회원정보 수정 완료입니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as UpdateMyInfoSuccessResponse
  }

  return {
    httpStatus: "BAD_REQUEST",
    statusValue: 400,
    success: false,
    code: "VALIDATION_ERROR",
    message: result.message || "잘못된 요청입니다.",
    timestamp: new Date().toISOString()
  } as UpdateMyInfoErrorResponse
}

/**
 * 프로필 이미지 수정
 */
export async function updateProfileImage(
  data: UpdateProfileImageRequest
): Promise<UpdateProfileImageSuccessResponse | UpdateProfileImageErrorResponse> {
  const result = await apiPut<UpdateProfileImageSuccessResponse["data"]>(
    "/api/v1/user/me/profile-image",
    data,
    { requiresAuth: true }
  )

  if (result.success && result.data) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
         code: "UPDATE_MY_PROFILE_IMAGE",
      message: "프로필 이미지 수정 완료입니다.",
      timestamp: new Date().toISOString(),
      data: result.data
    } as UpdateProfileImageSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "IMAGE_NOT_FOUND",
    message: result.message || "이미지를 찾을 수 없습니다.",
    timestamp: new Date().toISOString()
  } as UpdateProfileImageErrorResponse
}

/**
 * 프로필 이미지 삭제
 */
export async function deleteProfileImage(): Promise<DeleteProfileImageSuccessResponse | DeleteProfileImageErrorResponse> {
  const result = await apiDelete<null>(
    "/api/v1/user/me/profile-image",
    { requiresAuth: true }
  )

  if (result.success) {
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "DELETE_PROFILE_IMAGE",
      message: "프로필 이미지 삭제 완료입니다.",
      timestamp: new Date().toISOString()
    } as DeleteProfileImageSuccessResponse
  }

  return {
    httpStatus: "NOT_FOUND",
    statusValue: 404,
    success: false,
    code: "PROFILE_IMAGE_NOT_FOUND",
    message: result.message || "프로필 이미지를 찾을 수 없습니다.",
    timestamp: new Date().toISOString()
  } as DeleteProfileImageErrorResponse
}