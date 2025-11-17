"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react";

function PaymentFailPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState("결제에 실패했습니다.")

  useEffect(() => {
    // Toss Payments에서 전달하는 에러 정보
    const code = searchParams.get("code")
    const message = searchParams.get("message")
    const orderId = searchParams.get("orderId")

    console.log("[Payment Fail] Received params:", { code, message, orderId })

    if (message) {
      setErrorMessage(decodeURIComponent(message))
    } else if (code) {
      // 에러 코드별 메시지 매핑
      const errorMessages: Record<string, string> = {
        "USER_CANCEL": "사용자가 결제를 취소했습니다.",
        "INVALID_CARD_COMPANY": "유효하지 않은 카드사입니다.",
        "INCORRECT_CARD_INFO": "카드 정보가 올바르지 않습니다.",
        "CARD_EXPIRED": "카드가 만료되었습니다.",
        "NOT_AVAILABLE_PAYMENT": "결제 가능한 상태가 아닙니다.",
        "EXCEED_MAX_CARD_INSTALL_PLAN": "설정 가능한 최대 할부 개월수를 초과했습니다.",
        "INVALID_REQUEST": "잘못된 요청입니다.",
        "FAILED_PAYMENT_INTERNAL_SYSTEM_PROCESSING": "결제 처리 중 오류가 발생했습니다.",
      }

      setErrorMessage(errorMessages[code] || `결제 오류 (${code})`)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6 flex justify-center">
          <span className="text-red-500">{errorMessage}</span>
        </div>
        <div className="text-center text-gray-500 text-sm">
          결제에 실패했습니다. 다시 시도해주세요.
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <PaymentFailPageInner />
    </Suspense>
  );
}
