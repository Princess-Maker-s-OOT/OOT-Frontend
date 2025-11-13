import { ApiSuccessResponse } from "@/lib/types/common"

/**
 * API 응답 생성 유틸리티
 */
export function createMockResponse<T>(data: T): any {
  return {
    httpStatus: "OK",
    statusValue: 200,
    success: true,
    code: "MOCK_DATA",
    message: "Mock data returned",
    timestamp: new Date().toISOString(),
    data,
  }
}

/**
 * 옷 목록 Mock 데이터
 */
export const MOCK_CLOTHES = [
  {
    clothesId: 1,
    categoryId: 1,
    name: "베이직 티셔츠",
    description: "심플한 디자인의 베이직 티셔츠",
    brand: "Basic Brand",
    color: "WHITE",
    size: "M",
    images: [
      {
        imageId: 1,
        imageUrl: "https://picsum.photos/200/300?random=1",
      }
    ],
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    clothesId: 2,
    categoryId: 2,
    name: "데님 청바지",
    description: "클래식한 스타일의 데님 청바지",
    brand: "Denim Brand",
    color: "BLUE",
    size: "32",
    images: [
      {
        imageId: 2,
        imageUrl: "https://picsum.photos/200/300?random=2",
      }
    ],
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
]

/**
 * 옷장 목록 Mock 데이터
 */
export const MOCK_CLOSETS = [
  {
    closetId: 1,
    name: "일상복 옷장",
    description: "평소에 자주 입는 옷들",
    imageUrl: "https://picsum.photos/200/300?random=3",
    isPublic: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    closetId: 2,
    name: "특별한 날 옷장",
    description: "특별한 날 입는 옷들",
    imageUrl: "https://picsum.photos/200/300?random=4",
    isPublic: false,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
]

/**
 * 사용자 정보 Mock 데이터
 */
export const MOCK_USER = {
  imageUrl: null,
  loginId: "admin",
  email: "admin@oot.com",
  nickname: "관리자",
  username: "관리자",
  phoneNumber: "01012345678",
  tradeAddress: "서울시 강남구",
  tradeLatitude: 37.4979,
  tradeLongitude: 127.0276,
  loginType: "LOGIN_ID" as "LOGIN_ID",
  socialProvider: null,
}

export function mockLogin(loginId: string, password: string) {
  if (loginId === "admin" && password === "Zxcv1234!") {
    return {
      success: true,
      user: MOCK_USER,
      token: "mock-admin-token",
    }
  }
  return {
    success: false,
    message: "아이디 또는 비밀번호가 올바르지 않습니다.",
  }
}