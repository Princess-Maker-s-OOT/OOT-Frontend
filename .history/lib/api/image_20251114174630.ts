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
  return apiPost("/api/v1/images/presigned-urls", data)
}

export async function saveImageMetadata(
  data: SaveImageMetadataRequest
): Promise<SaveImageMetadataSuccessResponse | SaveImageMetadataErrorResponse> {
  return apiPost("/api/v1/images", data)
}