export interface SalePostSummaryResponse {
  salePostId: number
  title: string
  price: number
  status: string
  tradeAddress: string
  createdAt: string
  imageUrls: string[]
}
export type SalePostStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "TRADING"
  | "COMPLETED"
  | "CANCELLED"
  | "DELETED"

export interface UpdateSalePostStatusRequest {
  status: SalePostStatus
}

export interface UpdateSalePostStatusSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "SALE_POST_STATUS_UPDATED"
  message: string
  timestamp: string
  data: {
    salePostId: number
    title: string
    content: string
    price: number
    status: SalePostStatus
    tradeAddress: string
    tradeLatitude: number
    tradeLongitude: number
    sellerId: number
    sellerNickname: string
    categoryName: string
    imageUrls: string[]
    createdAt: string
    updatedAt: string
  }
}

export interface UpdateSalePostStatusErrorResponse {
  httpStatus: "FORBIDDEN" | "NOT_FOUND"
  statusValue: 403 | 404
  success: false
  code: "UNAUTHORIZED_ACCESS" | "SALE_POST_NOT_FOUND"
  message: string
  timestamp: string
}