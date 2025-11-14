"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { confirmTransaction } from "@/lib/api/transactions"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing")
  const [message, setMessage] = useState("결제를 처리하는 중입니다...")

  useEffect(() => {
    async function processPayment() {
      const paymentKey = searchParams.get("paymentKey")
      const transactionId = searchParams.get("transactionId")

      if (!paymentKey || !transactionId) {
        setStatus("error")
        setMessage("결제 정보가 올바르지 않습니다.")
        return
      }

      try {
        const result = await confirmTransaction(Number(transactionId), paymentKey)

        if (result.success && result.data) {
          setStatus("success")
          setMessage("결제가 성공적으로 완료되었습니다!")
          
          // 3초 후 판매글 목록으로 이동
          setTimeout(() => router.push("/sale-posts"), 3000)
        } else {
          setStatus("error")
          setMessage(result.message || "결제 승인에 실패했습니다.")
        }
      } catch (error: any) {
        console.error("결제 승인 오류:", error)
        setStatus("error")
        setMessage(error?.message || "결제 처리 중 오류가 발생했습니다.")
      }
    }

    processPayment()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-600 mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
              결제 처리 중
            </h2>
            <p className="text-center text-gray-600">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              결제 완료!
            </h2>
            <p className="text-center text-gray-600 mb-4">{message}</p>
            <p className="text-center text-sm text-gray-500">판매자가 수락하면 거래가 시작됩니다.</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <svg
                  className="h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
              결제 실패
            </h2>
            <p className="text-center text-gray-600 mb-6">{message}</p>

            <button
              onClick={() => router.push("/sale-posts")}
              className="block w-full bg-sky-600 text-white text-center py-3 rounded-lg hover:bg-sky-700 transition-colors"
            >
              판매글 목록으로 돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  )
}
