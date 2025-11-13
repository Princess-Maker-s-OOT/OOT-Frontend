import type { CreateClothesSuccessResponse, CreateClothesErrorResponse } from "@/types/clothes"

export const MOCK_CLOTHES_RESPONSE_WITH_IMAGES: CreateClothesSuccessResponse = {
  httpStatus: "CREATED",
  statusValue: 201,
  success: true,
  code: "CLOTHES_CREATED",
  message: "옷 등록 완료",
  timestamp: new Date().toISOString(),
  data: {
    id: 101,
    categoryId: 20203,
    userId: 501,
    clothesSize: "M",
    clothesColor: "BLACK",
    description: "심플한 블랙 니트입니다.",
    clothesImages: [
      {
        imageId: 1,
        imageUrl: "/mock-images/black-knit-main.jpg",
        isMain: true,
      },
      {
        imageId: 2,
        imageUrl: "/mock-images/black-knit-side.jpg",
        isMain: false,
      },
    ],
  },
}

export const MOCK_CLOTHES_RESPONSE_NO_IMAGES: CreateClothesSuccessResponse = {
  httpStatus: "CREATED",
  statusValue: 201,
  success: true,
  code: "CLOTHES_CREATED",
  message: "옷 등록 완료 (이미지 없음)",
  timestamp: new Date().toISOString(),
  data: {
    id: 102,
    categoryId: 20204,
    userId: 502,
    clothesSize: "L",
    clothesColor: "WHITE",
    description: "화이트 후드티입니다. 이미지 없이 등록됨.",
    clothesImages: [],
  },
}

export const MOCK_CLOTHES_ERROR_RESPONSE: CreateClothesErrorResponse = {
  httpStatus: "BAD_REQUEST",
  statusValue: 400,
  success: false,
  code: "VALIDATION_ERROR",
  message: "유효성 검사 실패",
  data: "description은 공백일 수 없습니다",
  timestamp: new Date().toISOString(),
}