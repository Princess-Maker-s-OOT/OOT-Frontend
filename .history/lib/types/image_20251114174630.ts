export interface CreatePresignedUrlRequest {
  fileName: string
  type: "closet" | "clothes" | "salepost" | "user"
}

export interface SaveImageMetadataRequest {
  s3Key: string
  fileName: string
  url: string
  contentType: string
  type: "CLOSET" | "CLOTHES" | "SALEPOST" | "USER"
  size: number
}

export interface CreatePresignedUrlSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "PRESIGNED_URL_CREATED"
  message: string
  timestamp: string
  data: {
    presignedUrl: string
    fileUrl: string
    s3Key: string
    expiresIn: number
  }
}

export interface CreatePresignedUrlErrorResponse {
  httpStatus: "BAD_REQUEST"
  statusValue: 400
  success: false
  code: "INVALID_FILE_NAME"
  message: string
  data: null
  timestamp: string
}

export interface SaveImageMetadataSuccessResponse {
  httpStatus: "CREATED"
  statusValue: 201
  success: true
  code: "IMAGE_SAVED"
  message: string
  timestamp: string
  data: {
    id: number
    fileName: string
    url: string
    s3Key: string
    contentType: string
    type: "CLOSET" | "CLOTHES" | "SALEPOST" | "USER"
    size: number
    createdAt: string
    updatedAt: string
  }
}

export interface SaveImageMetadataErrorResponse {
  httpStatus: "BAD_REQUEST" | "CONFLICT" | "INTERNAL_SERVER_ERROR"
  statusValue: 400 | 409 | 500
  success: false
  code: "VALIDATION_ERROR" | "IMAGE_ALREADY_EXISTS" | "UNEXPECTED_SERVER_ERROR"
  message: string
  data: string | null
  timestamp: string
}