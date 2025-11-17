"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { requestTransaction, generateTossOrderId, PaymentMethod } from "@/lib/api/transactions"
import { SaleStatus } from "@/lib/api/sale-posts"

interface PurchaseButtonProps {
  salePostId: number
  title: string
  price: number
  sellerId: number
  status: string
}

export default function PurchaseButton({
  salePostId,
  title,
  price,
  sellerId,
  status,
}: PurchaseButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    // 로그인 확인
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")
    
    console.log("[PurchaseButton] 토큰 확인:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      accessTokenLength: accessToken?.length || 0,
      accessTokenPreview: accessToken?.substring(0, 20) + "..." || "없음"
    })

    if (!accessToken) {
      alert("로그인이 필요합니다.")
      router.push("/login")
      return
    }

    // 판매 가능 상태 확인
    if (status !== "AVAILABLE") {
      alert("구매할 수 없는 상태입니다.")
      return
    }

    setLoading(true)

    try {
      // 1. 토스 주문 ID 생성 (UUID)
      const tossOrderId = generateTossOrderId()

      console.log("[PurchaseButton] 거래 요청 데이터:", {
        salePostId,
        amount: price,
        method: PaymentMethod.EASY_PAY,
        tossOrderId,
      })

      // 2. 거래 요청 API 호출
      const transactionResult = await requestTransaction({
        salePostId,
        amount: price,
        method: PaymentMethod.EASY_PAY,
        tossOrderId,
      })

      console.log("[PurchaseButton] 거래 요청 응답:", transactionResult)

      if (!transactionResult.success) {
        console.error("[PurchaseButton] 거래 요청 실패:", {
          success: transactionResult.success,
          message: transactionResult.message,
          code: (transactionResult as any).code,
          error: transactionResult.error,
          fullResponse: transactionResult
        })
        // 에러 메시지 보강
        let errorMsg = transactionResult.message || transactionResult.error?.message || "거래 요청 실패 (서버 오류)"
        throw new Error(errorMsg)
      }

      if (!transactionResult.data?.transactionId) {
        console.error("[PurchaseButton] transactionId 없음:", transactionResult.data)
        throw new Error("거래 ID를 받지 못했습니다.")
      }

      const { transactionId } = transactionResult.data

      // 3. 토스 페이먼츠 SDK 동적 로드
      const { loadTossPayments } = await import("@tosspayments/payment-sdk")

      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY
      if (!clientKey) {
        throw new Error("토스 페이먼츠 클라이언트 키가 설정되지 않았습니다.")
      }

      // 4. 토스 페이먼츠 결제 위젯 열기
      const tossPayments = await loadTossPayments(clientKey)

      await tossPayments.requestPayment("카드", {
        amount: price,
        orderId: tossOrderId,
        orderName: title,
        successUrl: `${window.location.origin}/payment/success?transactionId=${transactionId}&orderId=${tossOrderId}`,
        failUrl: `${window.location.origin}/payment/fail?transactionId=${transactionId}&orderId=${tossOrderId}`,
      })
    } catch (error: any) {
      console.error("구매 처리 오류:", error)
      
      // 에러 메시지 처리
      let errorMessage = "구매 처리 중 오류가 발생했습니다."
      
      if (error?.message) {
        if (error.message.includes("채팅")) {
          errorMessage = "거래를 시작하려면 판매자와 먼저 채팅을 시작해주세요."
        } else if (error.message.includes("본인")) {
          errorMessage = "본인의 판매글은 구매할 수 없습니다."
        } else if (error.message.includes("unique") || error.message.includes("중복")) {
          errorMessage = "채팅방 중복 오류입니다. 새로고침 후 다시 시도해주세요."
        } else if (error.message.includes("거래 ID")) {
          errorMessage = "거래 생성에 실패했습니다. 다시 시도해주세요."
        } else {
          errorMessage = error.message
        }
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || status !== "AVAILABLE"
  const buttonText = () => {
    if (loading) return "처리중..."
    if (status === "COMPLETED") return "판매완료"
    if (status === "RESERVED") return "예약중"
    if (status === "TRADING") return "거래중"
    return "구매하기"
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={isDisabled}
      className="h-10 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
    >
      {buttonText()}
    </Button>
  )
}
