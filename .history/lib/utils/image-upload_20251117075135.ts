import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import type {
  CreatePresignedUrlRequest,
  SaveImageMetadataRequest,
} from "@/lib/types/image"

/**
 * S3 Presigned URL을 사용한 이미지 업로드 헬퍼 함수
 */
export async function uploadImageToS3(
  file: File,
  accessToken: string,
  directory: "clothes" | "closet" | "sale-post" | "profile" = "clothes"
): Promise<{ imageId: number; imageUrl: string } | null> {
  try {
    // 1단계: Presigned URL 요청
    const presignedRequest: CreatePresignedUrlRequest = {
      fileName: file.name,
      type: directory === "profile" ? "user" : directory,
    }

    const presignedResponse = await createPresignedUrl(presignedRequest, accessToken)

    if (!presignedResponse.success || !presignedResponse.data) {
      console.error("Presigned URL 생성 실패:", presignedResponse)
      return null
    }

    const { presignedUrl, imageUrl, imageId } = presignedResponse.data

    // 2단계: S3에 이미지 업로드
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })

    if (!uploadResponse.ok) {
      console.error("S3 업로드 실패:", uploadResponse.status)
      return null
    }

    // 3단계: 이미지 메타데이터 저장
    const metadataRequest: SaveImageMetadataRequest = {
      imageId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      imageUrl,
    }

    const metadataResponse = await saveImageMetadata(metadataRequest, accessToken)

    if (!metadataResponse.success) {
      console.error("이미지 메타데이터 저장 실패:", metadataResponse)
      return null
    }

    return { imageId, imageUrl }
  } catch (error) {
    console.error("이미지 업로드 중 오류:", error)
    return null
  }
}

/**
 * 여러 이미지를 순차적으로 업로드
 */
export async function uploadMultipleImagesToS3(
  files: File[],
  accessToken: string,
  directory: "clothes" | "closet" | "sale-post" | "profile" = "clothes"
): Promise<Array<{ imageId: number; imageUrl: string }>> {
  const results: Array<{ imageId: number; imageUrl: string }> = []

  for (const file of files) {
    const result = await uploadImageToS3(file, accessToken, directory)
    if (result) {
      results.push(result)
    }
  }

  return results
}

/**
 * 이미지 파일 유효성 검사
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // 파일 크기 제한 (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { valid: false, error: "파일 크기는 5MB 이하여야 합니다." }
  }

  // 파일 타입 검사
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "지원하지 않는 이미지 형식입니다. (JPEG, PNG, GIF, WebP만 가능)" }
  }

  return { valid: true }
}

/**
 * 여러 이미지 파일 유효성 검사
 */
export function validateImageFiles(files: File[]): { valid: boolean; error?: string } {
  for (const file of files) {
    const result = validateImageFile(file)
    if (!result.valid) {
      return result
    }
  }
  return { valid: true }
}
