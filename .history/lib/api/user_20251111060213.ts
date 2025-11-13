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

import { MOCK_USER, createMockResponse } from "../mocks"
import { apiGet, apiPatch, apiPost } from "./utils"
import { API_CONFIG } from "../config"

/**
 * 내 정보 조회
 */
export async function getMyInfo(
  accessToken?: string
): Promise<GetMyInfoSuccessResponse | GetMyInfoErrorResponse> {
  // 로그인하지 않은 경우 mock 데이터 반환
  if (!accessToken) {
    return createMockResponse(MOCK_USER)
  }

  return await apiGet<GetMyInfoSuccessResponse, GetMyInfoErrorResponse>(
    API_CONFIG.ENDPOINTS.USER.ME,
    { accessToken }
  )
}

/**
 * 비밀번호 확인
 */
export async function verifyPassword(
  data: VerifyPasswordRequest,
  accessToken: string
): Promise<VerifyPasswordSuccessResponse | VerifyPasswordErrorResponse> {
  return await apiPost<VerifyPasswordSuccessResponse, VerifyPasswordErrorResponse>(
    API_CONFIG.ENDPOINTS.USER.VERIFY_PASSWORD,
    data,
    { accessToken }
  )
}

/**
 * 내 정보 수정
 */
export async function updateMyInfo(
  data: UpdateMyInfoRequest,
  accessToken: string
): Promise<UpdateMyInfoSuccessResponse | UpdateMyInfoErrorResponse> {
  return await apiPatch<UpdateMyInfoSuccessResponse, UpdateMyInfoErrorResponse>(
    API_CONFIG.ENDPOINTS.USER.ME,
    data,
    { accessToken }
  )
}

export async function updateProfileImage(
  data: UpdateProfileImageRequest,
  accessToken: string
): Promise<UpdateProfileImageSuccessResponse | UpdateProfileImageErrorResponse> {
  return await apiPatch<UpdateProfileImageSuccessResponse, UpdateProfileImageErrorResponse>(
    API_CONFIG.ENDPOINTS.USER.PROFILE_IMAGE,
    data,
    { accessToken }
  )
}

export async function deleteProfileImage(
  accessToken: string
): Promise<DeleteProfileImageSuccessResponse | DeleteProfileImageErrorResponse> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER.PROFILE_IMAGE}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  })
  
  return await response.json()
}