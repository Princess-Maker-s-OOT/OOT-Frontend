import type {
  PaymentConfirmRequest,
  PaymentConfirmSuccessResponse,
  PaymentConfirmErrorResponse,
  PaymentFailRequest,
  PaymentFailSuccessResponse,
  PaymentFailErrorResponse,
} from "@/lib/types/payment"

/**
 * 토스 페이먼츠 결제 승인 API
 */
export async function confirmPayment(
  data: PaymentConfirmRequest,
  accessToken: string
): Promise<PaymentConfirmSuccessResponse | PaymentConfirmErrorResponse> {
  // Next.js 프록시를 사용하므로 빈 문자열 사용
  const API_BASE_URL = ""

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/confirm`, {
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

/**
 * 결제 실패 처리 API
 */
export async function failPayment(
  paymentId: number,
  data: PaymentFailRequest,
  accessToken: string
): Promise<PaymentFailSuccessResponse | PaymentFailErrorResponse> {
  // Next.js 프록시를 사용하므로 빈 문자열 사용
  const API_BASE_URL = ""

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}/fail`, {
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

/**
 * 결제 정보 조회 API
 */
export async function getPaymentById(
  paymentId: number,
  accessToken: string
): Promise<any> {
  // Next.js 프록시를 사용하므로 빈 문자열 사용
  const API_BASE_URL = ""

  const response = await fetch(`${API_BASE_URL}/api/v1/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}
