/**
 * 거래(Transaction) 및 결제(Payment) 관련 API 클라이언트
 */

import { apiGet, apiPost } from "./client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// ==================== Enum 타입 ====================

export enum PaymentMethod {
  ACCOUNT_TRANSFER = "ACCOUNT_TRANSFER",  // 계좌이체
  EASY_PAY = "EASY_PAY"                   // 간편결제
}

export enum EasyPayProvider {
  TOSS_PAY = "TOSS_PAY",      // 토스페이
  NAVER_PAY = "NAVER_PAY"     // 네이버페이
}

export enum PaymentStatus {
  PENDING = "PENDING",        // 결제대기중
  FAILED = "FAILED",          // 결제 실패
  ESCROWED = "ESCROWED",      // 예치중
  SETTLED = "SETTLED",        // 정산예정
  REFUNDED = "REFUNDED"       // 환불예정
}

export enum TransactionStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",       // 판매자 수락 대기
  APPROVED = "APPROVED",                       // 판매자 수락 완료 (거래중)
  CONFIRMED = "CONFIRMED",                     // 구매확정
  CANCELLED_BY_BUYER = "CANCELLED_BY_BUYER",   // 구매자 취소
  CANCELLED_BY_SELLER = "CANCELLED_BY_SELLER", // 판매자 취소
  PAYMENT_FAILED = "PAYMENT_FAILED",           // 결제 실패
  EXPIRED = "EXPIRED"                          // 거래 만료
}

// ==================== 요청 타입 ====================

export interface RequestTransactionRequest {
  salePostId: number
  amount: number
  method: PaymentMethod
  easyPayProvider?: EasyPayProvider  // 간편결제일 때만
  tossOrderId: string  // UUID
}

export interface TransactionConfirmRequest {
  paymentKey: string  // 토스 결제 승인 키
}

// ==================== 응답 타입 ====================

export interface TransactionResponse {
  transactionId: number
  tossOrderId: string
  price: number
  status: TransactionStatus
  salePostTitle: string
  sellerId: number
  sellerNickname: string
  paymentMethod: PaymentMethod
}

export interface TransactionAcceptResponse {
  transactionId: number
  price: number
  status: TransactionStatus
  salePostTitle: string
  buyerId: number
  buyerNickname: string
}

export interface TransactionCompleteResponse {
  transactionId: number
  status: TransactionStatus
  confirmedAt: string
}

export interface TransactionCancelResponse {
  transactionId: number
  status: TransactionStatus
  cancelRequestedAt: string
  paymentStatus: PaymentStatus
  salePostStatus: string
}

export interface ApiResponse<T> {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
  data: T
}

// ==================== API 함수 ====================

/**
 * 거래 요청 (결제 정보 생성)
 * - 판매글에 대한 거래를 시작하고 결제 정보를 생성합니다
 * - 채팅방이 존재하고 최소 1회 이상 대화가 필요합니다
 */
export async function requestTransaction(
  request: RequestTransactionRequest
): Promise<ApiResponse<TransactionResponse>> {
  return apiPost(`${API_BASE_URL}/api/v1/transactions/request`, request)
}

/**
 * 결제 승인 (토스페이먼츠 confirm)
 * - 토스 결제 위젯에서 받은 paymentKey로 최종 승인
 * - 10분 이내에 승인해야 합니다
 */
export async function confirmTransaction(
  transactionId: number,
  paymentKey: string
): Promise<ApiResponse<TransactionResponse>> {
  return apiPost(
    `${API_BASE_URL}/transactions/${transactionId}/confirm`,
    { paymentKey }
  )
}

/**
 * 거래 수락 (판매자)
 * - 판매자가 결제 완료된 거래를 수락합니다
 * - 상태: PENDING_APPROVAL → APPROVED
 * - 판매글 상태: RESERVED → TRADING
 */
export async function acceptTransaction(
  transactionId: number
): Promise<ApiResponse<TransactionAcceptResponse>> {
  return apiPost(`${API_BASE_URL}/api/v1/transactions/${transactionId}/accept`, {})
}

/**
 * 거래 확정 (구매자)
 * - 구매자가 물건을 받은 후 거래를 최종 확정합니다
 * - 상태: APPROVED → CONFIRMED
 * - 판매글 상태: TRADING → COMPLETED
 * - 결제 상태: ESCROWED → SETTLED
 */
export async function completeTransaction(
  transactionId: number
): Promise<ApiResponse<TransactionCompleteResponse>> {
  return apiPost(`${API_BASE_URL}/api/v1/transactions/${transactionId}/complete`, {})
}

/**
 * 구매자 취소
 * - 판매자 수락 이전에만 취소 가능
 * - 상태: PENDING_APPROVAL → CANCELLED_BY_BUYER
 * - 결제 상태: ESCROWED → REFUNDED
 * - 판매글 상태: RESERVED → AVAILABLE
 */
export async function cancelTransactionByBuyer(
  transactionId: number
): Promise<ApiResponse<TransactionCancelResponse>> {
  return apiPost(`${API_BASE_URL}/transactions/${transactionId}/cancel-buyer`, {})
}

/**
 * 토스 주문 ID 생성 헬퍼
 * - UUID v4 형식
 */
export function generateTossOrderId(): string {
  return crypto.randomUUID()
}
