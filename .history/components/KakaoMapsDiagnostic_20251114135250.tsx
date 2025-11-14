"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DiagnosticResult {
  step: string
  status: "pending" | "success" | "error" | "warning"
  message: string
  details?: string
  timestamp: string
}

/**
 * Kakao Maps SDK 로딩 진단 컴포넌트
 * 모든 단계를 세밀하게 추적하고 문제점을 식별합니다.
 */
export default function KakaoMapsDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [testResult, setTestResult] = useState<"idle" | "running" | "success" | "error">("idle")

  const addResult = (result: Omit<DiagnosticResult, "timestamp">) => {
    setResults((prev) => [...prev, { ...result, timestamp: new Date().toLocaleTimeString() }])
  }

  const runDiagnostics = async () => {
    setIsRunning(true)
    setTestResult("running")
    setResults([])

    try {
      // Step 1: API 키 확인
      const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY
      if (!apiKey) {
        addResult({
          step: "1. API 키 확인",
          status: "error",
          message: "NEXT_PUBLIC_KAKAO_MAPS_APP_KEY 환경변수가 설정되지 않았습니다.",
          details: "환경 설정을 확인해주세요.",
        })
        setTestResult("error")
        setIsRunning(false)
        return
      }

      addResult({
        step: "1. API 키 확인",
        status: "success",
        message: "API 키가 설정되어 있습니다.",
        details: `API Key (masked): ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`,
      })

      // Step 2: 스크립트 생성 및 로드
      addResult({
        step: "2. SDK 스크립트 생성",
        status: "pending",
        message: "Kakao Maps SDK 스크립트를 로드 중입니다...",
      })

      const scriptUrl = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing`
      console.log("📋 스크립트 URL:", scriptUrl.substring(0, 60) + "...")

      // Step 3: 스크립트 로드
      return new Promise<void>((resolve) => {
        const script = document.createElement("script")
        script.src = scriptUrl
        script.async = true
        script.defer = true

        // 로드 시작
        script.onloadstart = () => {
          addResult({
            step: "3. 스크립트 로드 시작",
            status: "pending",
            message: "CDN에서 스크립트를 다운로드 중입니다...",
            details: `URL: dapi.kakao.com`,
          })
        }

        // 로드 진행 중
        script.onload = () => {
          addResult({
            step: "4. 스크립트 로드 완료",
            status: "success",
            message: "Kakao Maps SDK 스크립트 로드 성공",
            details: `로드된 스크립트 크기 및 상태 확인됨`,
          })

          // Step 5: 카카오 객체 확인
          setTimeout(() => {
            const kakao = (window as any).kakao
            if (kakao && kakao.maps) {
              addResult({
                step: "5. Kakao 객체 확인",
                status: "success",
                message: "window.kakao.maps 객체가 로드되었습니다.",
                details: `Version: ${kakao.maps.version || "unknown"}`,
              })

              // Step 6: kakao.maps.load()로 초기화 대기
              kakao.maps.load(() => {
                try {
                  addResult({
                    step: "6. Kakao Maps 초기화",
                    status: "success",
                    message: "kakao.maps.load() 완료",
                    details: "모든 API가 사용 가능한 상태입니다.",
                  })

                  // Step 7: 기본 API 가용성 테스트
                  const testLat = 37.5665
                  const testLng = 126.978
                  const testLatLng = new kakao.maps.LatLng(testLat, testLng)

                  addResult({
                    step: "7. API 가용성 테스트",
                    status: "success",
                    message: "기본 API 호출 테스트 성공",
                    details: `테스트 좌표: (${testLat}, ${testLng}) - LatLng 객체 생성 성공`,
                  })

                  // Step 8: 다른 클래스 확인
                  const classes = [
                    "Map",
                    "Marker",
                    "InfoWindow",
                    "LatLng",
                    "MarkerImage",
                    "Size",
                    "Point",
                    "event",
                  ]

                  const missingClasses = classes.filter((cls) => !kakao.maps[cls])

                  if (missingClasses.length === 0) {
                    addResult({
                      step: "8. 필수 클래스 확인",
                      status: "success",
                      message: "모든 필수 Kakao Maps 클래스가 로드되었습니다.",
                      details: `로드된 클래스: ${classes.join(", ")}`,
                    })
                  } else {
                    addResult({
                      step: "8. 필수 클래스 확인",
                      status: "warning",
                      message: "일부 클래스가 로드되지 않았습니다.",
                      details: `누락된 클래스: ${missingClasses.join(", ")}`,
                    })
                  }

                  // 최종 결과
                  setTestResult("success")
                  addResult({
                    step: "✅ 최종 결과",
                    status: "success",
                    message: "Kakao Maps SDK가 정상적으로 로드되었습니다!",
                    details: "기부처 검색 페이지를 방문하여 지도를 확인해보세요.",
                  })
                } catch (err) {
                  addResult({
                    step: "7. API 가용성 테스트",
                    status: "error",
                    message: "API 호출 중 오류 발생",
                    details: String(err),
                  })
                  setTestResult("error")
                } finally {
                  setIsRunning(false)
                  resolve()
                }
              })
            } else {
              addResult({
                step: "5. Kakao 객체 확인",
                status: "error",
                message: "window.kakao.maps 객체를 찾을 수 없습니다.",
                details: "스크립트는 로드되었지만 Kakao 객체가 초기화되지 않았습니다.",
              })
              setTestResult("error")
              setIsRunning(false)
              resolve()
            }
          }, 500)
        }

        script.onerror = (error) => {
          addResult({
            step: "4. 스크립트 로드 실패",
            status: "error",
            message: "Kakao Maps SDK 스크립트 로드 실패",
            details: `오류: ${String(error)}`,
          })
          setTestResult("error")
          setIsRunning(false)
          resolve()
        }

        document.head.appendChild(script)
      })
    } catch (err) {
      addResult({
        step: "❌ 예외 발생",
        status: "error",
        message: "진단 중 예외가 발생했습니다.",
        details: String(err),
      })
      setTestResult("error")
      setIsRunning(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card className="p-6 border-2 border-oot-sky-200 bg-gradient-to-br from-white to-oot-sky-50">
        <h2 className="text-2xl font-bold text-oot-sky-accent mb-2">
          🗺️ Kakao Maps SDK 진단
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Kakao Maps SDK 로딩을 단계별로 진단하고 문제점을 식별합니다.
        </p>

        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className={cn(
            "w-full mb-6 font-semibold text-white",
            isRunning
              ? "bg-gray-400"
              : testResult === "success"
                ? "bg-green-600 hover:bg-green-700"
                : testResult === "error"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-oot-sky-accent hover:bg-sky-600"
          )}
        >
          {isRunning
            ? "진단 중... ⏳"
            : testResult === "success"
              ? "✅ 진단 완료 (성공)"
              : testResult === "error"
                ? "❌ 진단 완료 (실패)"
                : "진단 시작"}
        </Button>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {results.length === 0 && !isRunning && (
            <div className="text-center py-8 text-gray-500">
              <p>진단을 시작하려면 위의 버튼을 클릭하세요.</p>
            </div>
          )}

          {results.map((result, idx) => (
            <div
              key={idx}
              className={cn(
                "p-3 rounded border-l-4 text-sm",
                result.status === "success"
                  ? "bg-green-50 border-green-500 text-green-900"
                  : result.status === "error"
                    ? "bg-red-50 border-red-500 text-red-900"
                    : result.status === "warning"
                      ? "bg-yellow-50 border-yellow-500 text-yellow-900"
                      : "bg-blue-50 border-blue-500 text-blue-900"
              )}
            >
              <div className="font-semibold">{result.step}</div>
              <div className="text-xs mt-1">{result.message}</div>
              {result.details && (
                <div className="text-xs opacity-75 mt-1 font-mono bg-white bg-opacity-50 p-1 rounded">
                  {result.details}
                </div>
              )}
              <div className="text-xs opacity-50 mt-1">{result.timestamp}</div>
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-6 pt-4 border-t border-oot-sky-200">
            <h3 className="font-semibold text-sm mb-2">📋 결과 요약</h3>
            <div className="text-xs space-y-1">
              {testResult === "success" && (
                <p className="text-green-700">
                  ✅ Kakao Maps SDK가 정상적으로 로드되었습니다. 모든 기능을 사용할 수 있습니다.
                </p>
              )}
              {testResult === "error" && (
                <>
                  <p className="text-red-700">
                    ❌ Kakao Maps SDK 로딩에 문제가 있습니다. 위의 진단 결과를 확인해주세요.
                  </p>
                  <p className="text-gray-600 mt-2">
                    문제 해결 팁:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>NEXT_PUBLIC_KAKAO_MAPS_APP_KEY 환경변수 설정 확인</li>
                    <li>.env.development 파일에 올바른 API 키가 있는지 확인</li>
                    <li>개발 서버를 재시작해보세요</li>
                    <li>네트워크 연결 상태 확인</li>
                    <li>브라우저 콘솔에서 더 자세한 에러 메시지 확인</li>
                  </ul>
                </>
              )}
              {testResult === "idle" && (
                <p className="text-gray-600">진단을 시작하려면 위의 버튼을 클릭하세요.</p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
