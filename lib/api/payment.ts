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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  const response = await fetch(`${apiUrl}/payments/confirm`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  const response = await fetch(`${apiUrl}/payments/${paymentId}/fail`, {
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

  const response = await fetch(`${apiUrl}/payments/${paymentId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}
