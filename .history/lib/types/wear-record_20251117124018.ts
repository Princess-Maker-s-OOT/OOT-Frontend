export interface WearRecordItem {
  wearRecordId: number
  wornAt: string
  clothesId: number
  clothesName: string
  clothesImageUrl: string | null
}
// 착용 기록 생성 요청
export interface CreateWearRecordRequest {
  clothesId: number
}

// 착용 기록 생성 응답
export interface WearRecordCreateResponse {
  wearRecordId: number
}

// 내 착용 기록 조회 응답
export interface WearRecordGetMyResponse {
  wearRecordId: number
  wornAt: string // ISO 8601 format
  clothesId: number
  clothesName: string
  clothesImageUrl: string | null
}