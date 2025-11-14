/**
 * 토스 페이먼츠 관련 타입 정의
 */

// 결제 요청
export interface PaymentRequest {
  salePostId: number
  amount: number
  orderId: string
  orderName: string
}

// 결제 승인 요청
export interface PaymentConfirmRequest {
  paymentKey: string
  orderId: string
  amount: number
}

// 결제 승인 성공 응답
export interface PaymentConfirmSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: string
  message: string
  timestamp: string
  data: {
    paymentId: number
    paymentKey: string
    orderId: string
    amount: number
    status: "SUCCESS" | "FAILED" | "PENDING"
    receiptUrl: string
    approvedAt: string
  }
}

// 결제 승인 실패 응답
export interface PaymentConfirmErrorResponse {
  httpStatus: string
  statusValue: number
  success: false
  code: string
  message: string
  timestamp: string
}

// 결제 실패 요청
export interface PaymentFailRequest {
  paymentId: number
  reason: string
}

// 결제 실패 성공 응답
export interface PaymentFailSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: string
  message: string
  timestamp: string
}

// 결제 실패 에러 응답
export interface PaymentFailErrorResponse {
  httpStatus: string
  statusValue: number
  success: false
  code: string
  message: string
  timestamp: string
}

// 결제 상태
export type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING" | "CANCELLED"

// 토스 결제 위젯 옵션
export interface TossPaymentWidgetOptions {
  clientKey: string
  customerKey: string
}
