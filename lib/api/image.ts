import type {
  CreatePresignedUrlRequest,
  CreatePresignedUrlSuccessResponse,
  CreatePresignedUrlErrorResponse,
  SaveImageMetadataRequest,
  SaveImageMetadataSuccessResponse,
  SaveImageMetadataErrorResponse,
} from "@/lib/types/image"

export async function createPresignedUrl(
  data: CreatePresignedUrlRequest,
  accessToken: string
): Promise<CreatePresignedUrlSuccessResponse | CreatePresignedUrlErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/images/presigned-urls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  return result
}

export async function saveImageMetadata(
  data: SaveImageMetadataRequest,
  accessToken: string
): Promise<SaveImageMetadataSuccessResponse | SaveImageMetadataErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  return result
}