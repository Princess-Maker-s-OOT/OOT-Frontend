import { apiPost } from "./client"
import type {
  CreatePresignedUrlRequest,
  CreatePresignedUrlSuccessResponse,
  CreatePresignedUrlErrorResponse,
  SaveImageMetadataRequest,
  SaveImageMetadataSuccessResponse,
  SaveImageMetadataErrorResponse,
} from "@/lib/types/image"

export async function createPresignedUrl(
  data: CreatePresignedUrlRequest
): Promise<CreatePresignedUrlSuccessResponse | CreatePresignedUrlErrorResponse> {
  console.log("createPresignedUrl 요청 데이터:", data)
  const result = await apiPost("/api/v1/images/presigned-urls", data)
  console.log("createPresignedUrl 응답:", result)
  return result
}

export async function saveImageMetadata(
  data: SaveImageMetadataRequest
): Promise<SaveImageMetadataSuccessResponse | SaveImageMetadataErrorResponse> {
  return apiPost("/api/v1/images", data)
}