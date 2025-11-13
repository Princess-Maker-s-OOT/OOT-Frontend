"use client"

import KakaoMapsDiagnostic from "@/components/KakaoMapsDiagnostic"
import { Card } from "@/components/ui/card"

export default function KakaoMapsTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-oot-sky-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-oot-sky-accent mb-3">
            🗺️ Kakao Maps SDK 테스트
          </h1>
          <p className="text-lg text-gray-600">
            Kakao Maps SDK의 로딩 상태를 진단하고 문제를 해결합니다.
          </p>
        </div>

        {/* 진단 도구 */}
        <KakaoMapsDiagnostic />

        {/* 정보 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="p-6 border-oot-sky-200 bg-gradient-to-br from-blue-50 to-oot-sky-50">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📝 설정 확인</h3>
            <ul className="text-sm space-y-2 text-blue-800">
              <li>✅ .env.local에 NEXT_PUBLIC_KAKAO_MAP_KEY 설정됨</li>
              <li>✅ API 키가 올바른 형식인지 확인</li>
              <li>✅ 개발 서버 재시작 후 확인</li>
            </ul>
          </Card>

          <Card className="p-6 border-oot-sky-200 bg-gradient-to-br from-green-50 to-oot-sky-50">
            <h3 className="text-lg font-semibold text-green-900 mb-4">🚀 다음 단계</h3>
            <ul className="text-sm space-y-2 text-green-800">
              <li>✅ 진단이 성공하면 기부처 검색 페이지 방문</li>
              <li>✅ 지도에서 마커와 정보창 표시 확인</li>
              <li>✅ 검색 기능 테스트</li>
            </ul>
          </Card>
        </div>

        {/* 문제 해결 가이드 */}
        <Card className="p-6 mt-12 border-oot-sky-200 bg-gradient-to-br from-yellow-50 to-oot-sky-50">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4">⚠️ 문제 해결 가이드</h3>
          <div className="space-y-4 text-sm text-yellow-800">
            <div>
              <h4 className="font-semibold mb-1">API 키 오류</h4>
              <p>
                환경변수 NEXT_PUBLIC_KAKAO_MAP_KEY가 올바르게 설정되어 있는지 확인하세요. 개발 서버를 재시작하면 변경사항이 반영됩니다.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">네트워크 오류</h4>
              <p>
                인터넷 연결 상태를 확인하고, 브라우저 콘솔(F12)의 Network 탭에서 dapi.kakao.com 요청 상태를 확인하세요.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">CORS 오류</h4>
              <p>
                Kakao Maps API는 클라이언트 환경에서만 로드됩니다. next.config.mjs에서 외부 스크립트 설정을 확인하세요.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">로드 지연</h4>
              <p>
                SDK 초기화 후 300ms 지연을 두어 Kakao 객체가 완전히 준비되도록 합니다. 진단 도구가 이를 자동으로 수행합니다.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
