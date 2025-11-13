export interface CreateWearRecordSuccessResponse {
  httpStatus: "CREATED"
  statusValue: 201
  success: true
  code: "WEAR_RECORD_CREATED"
  message: string
  timestamp: string
  data: {
    wearRecordId: number
  }
}
export interface CreateWearRecordRequest {
  clothesId: number
}

export interface CreateWearRecordErrorResponse {
  httpStatus: "BAD_REQUEST" | "NOT_FOUND"
  statusValue: 400 | 404
  success: false
  code: "VALIDATION_ERROR" | "CLOTHES_NOT_FOUND"
  message: string
  data: string | null
  timestamp: string
}

export interface WearRecordItem {
  wearRecordId: number
  wornAt: string
  clothesId: number
  clothesName: string
  clothesImageUrl: string
}

export interface GetWearRecordsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "WEAR_RECORDS_GET_OK"
  message: string
  timestamp: string
  data: {
    content: WearRecordItem[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}