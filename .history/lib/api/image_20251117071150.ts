import { apiPost } from "./client"
import type {
  CreatePresignedUrlRequest,
  CreatePresignedUrlSuccessResponse,
  CreatePresignedUrlErrorResponse,
  SaveImageMetadataRequest,
  SaveImageMetadataSuccessResponse,
  SaveImageMetadataErrorResponse,
} from "@/lib/types/image"

  data: CreatePresignedUrlRequest
): Promise<ApiResult<CreatePresignedUrlSuccessResponse | CreatePresignedUrlErrorResponse>> {
  console.log("=== createPresignedUrl 요청 ===")
  console.log("요청 데이터:", JSON.stringify(data, null, 2))
  const result = await apiPost("/api/v1/images/presigned-urls", data)
  console.log("=== createPresignedUrl 응답 ===")
  console.log("응답 전체:", JSON.stringify(result, null, 2))
  if (!result.success) {
    console.error("에러 메시지:", result.message)
    console.error("에러 데이터:", result.data)
  }
  return result
}

  data: SaveImageMetadataRequest
): Promise<ApiResult<SaveImageMetadataSuccessResponse | SaveImageMetadataErrorResponse>> {
  console.log("=== saveImageMetadata 요청 ===")
  console.log("요청 데이터:", JSON.stringify(data, null, 2))
  const result = await apiPost("/api/v1/images", data)
  console.log("=== saveImageMetadata 응답 ===")
  console.log("응답 전체:", JSON.stringify(result, null, 2))
  if (!result.success) {
    console.error("에러 메시지:", result.message)
    console.error("에러 데이터:", result.data)
  }
  return result
}