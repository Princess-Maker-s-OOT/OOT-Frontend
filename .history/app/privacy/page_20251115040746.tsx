import { Shield, Lock, Database, Users, Eye, Clock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-sky-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            개인정보처리방침
          </h1>
          <p className="text-lg text-gray-600">Privacy Policy</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2025년 11월 15일</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">
              <strong className="text-sky-600">OOT(Outfit Of Today)</strong>(이하 "회사" 또는 "서비스")는 
              「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 안전하게 보호하기 위해 
              다음과 같이 개인정보처리방침을 공개합니다. 본 방침은 OOT 서비스 이용과 관련하여 
              수집되는 모든 개인정보 처리에 적용됩니다.
            </p>
          </CardContent>
        </Card>

        {/* Section 1: 수집하는 개인정보 항목 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sky-600" />
              1. 수집하는 개인정보 항목
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">1) 회원가입 및 로그인(OAuth)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>필수:</strong> 이메일 주소, 이름(또는 닉네임), 구글 프로필 이미지</li>
                <li><strong>선택:</strong> 소셜 로그인 제공자가 제공하는 기타 프로필 정보</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">2) 서비스 이용 중 자동 수집 정보</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>IP 주소, 브라우저 정보, 기기 정보(OS/모델명)</li>
                <li>서비스 사용 기록, 쿠키, 접속 기록</li>
                <li>오류 로그 및 통계 데이터</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">3) 옷장/거래 서비스 이용 시</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>업로드 이미지(옷 사진 등)</li>
                <li>옷 정보(카테고리, 색상, 착용 기록 등)</li>
                <li>판매/거래 게시물 정보(제목, 내용, 가격 등)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">4) 결제 정보(토스페이먼츠)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>주문 번호, 결제 승인·취소 정보</li>
                <li>카드/계좌 정보는 회사가 저장하지 않음(PG사가 직접 처리)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-gray-800 mb-2">5) 위치 기반 정보(카카오맵 API)</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>지도 검색을 위한 위치 좌표 또는 주소</li>
                <li>GPS 자체 저장은 하지 않음</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: 수집 및 이용 목적 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-sky-600" />
              2. 개인정보 수집 및 이용 목적
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sky-100 border-b-2 border-sky-200">
                    <th className="p-3 text-left font-bold text-gray-800">목적</th>
                    <th className="p-3 text-left font-bold text-gray-800">상세 내용</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">회원 관리</td>
                    <td className="p-3">가입·로그인·인증 처리</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">서비스 제공</td>
                    <td className="p-3">디지털 옷장, 중고거래 기능 제공</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">추천 기능</td>
                    <td className="p-3">미착용 옷 기부/판매 추천 생성</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">거래 중개</td>
                    <td className="p-3">게시글 제공, 직거래 지원</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">결제 처리</td>
                    <td className="p-3">토스페이먼츠 결제 승인/취소</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">외부 API 활용</td>
                    <td className="p-3">카카오맵 기반 기부처 검색/지도 제공</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">서비스 개선</td>
                    <td className="p-3">오류 분석, 사용자 경험 개선</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium">법적 의무</td>
                    <td className="p-3">기록 보관, 분쟁 대응</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: 제3자 제공 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              3. 개인정보 제3자 제공
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-gray-700">
              회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
              단, 다음의 경우 제공될 수 있습니다.
            </p>

            <div className="space-y-4">
              <div className="bg-sky-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">✔ 구글(Google OAuth)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li><strong>제공 항목:</strong> 이메일, 프로필 이미지</li>
                  <li><strong>제공 목적:</strong> 로그인/인증</li>
                  <li><strong>비밀번호는 제공되지 않음</strong></li>
                </ul>
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">✔ 카카오맵(Local API)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li><strong>제공 항목:</strong> 검색 목적의 좌표/주소</li>
                  <li><strong>목적:</strong> 기부처 검색 및 지도 표시</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-2">✔ 토스페이먼츠(PG)</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 text-sm">
                  <li><strong>제공 항목:</strong> 주문/결제 정보</li>
                  <li><strong>목적:</strong> 결제 승인/취소 처리</li>
                  <li><strong>회사는 금융정보 자체를 저장하지 않음</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: 보관기간 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-600" />
              4. 개인정보의 보관기간
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-sky-100 border-b-2 border-sky-200">
                    <th className="p-3 text-left font-bold text-gray-800">항목</th>
                    <th className="p-3 text-left font-bold text-gray-800">보관 기간</th>
                    <th className="p-3 text-left font-bold text-gray-800">근거</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="p-3">회원 정보</td>
                    <td className="p-3">탈퇴 즉시 삭제</td>
                    <td className="p-3">법령 기준</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">거래 내역</td>
                    <td className="p-3">5년</td>
                    <td className="p-3">전자상거래법</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">결제 기록</td>
                    <td className="p-3">5년</td>
                    <td className="p-3">전자금융거래법</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">로그 기록</td>
                    <td className="p-3">1년</td>
                    <td className="p-3">통신비밀보호법</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">신고/제재 기록</td>
                    <td className="p-3">3년</td>
                    <td className="p-3">서비스 운영 정책</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Section 5-11: 나머지 섹션들 */}
        <div className="space-y-8">
          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>5. 개인정보 파기 절차 및 방법</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>탈퇴 시 즉시 파기</li>
                <li>서버 DB는 복구 불가능한 방식으로 영구 삭제</li>
                <li>법령상 보관 기간 종료 후 즉시 파기</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>6. 쿠키(Cookie) 활용</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>자동 로그인 및 편의 기능 제공</li>
                <li>브라우저 설정에서 쿠키 거부 가능</li>
                <li>거부 시 일부 기능 제한 가능</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-sky-600" />
                7. 개인정보 보호를 위한 기술적·관리적 조치
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>비밀번호·토큰 등 중요 정보 암호화</li>
                <li>접근 권한 최소화</li>
                <li>HTTPS 암호화 통신</li>
                <li>서버 보안 로그·접근 통제 시스템 운영</li>
                <li>이미지/S3 접근 권한 제한</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>8. 이용자의 권리</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-4">이용자는 언제든지 다음을 요청할 수 있습니다:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>개인정보 조회</li>
                <li>수정·정정</li>
                <li>삭제 요청</li>
                <li>처리 정지 요청</li>
              </ul>
              <p className="text-sky-700 font-medium mt-4">
                문의:{" "}
                <a 
                  href="https://www.instagram.com/outoftoday_official/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-sky-800"
                >
                  @outoftoday_official
                </a>
              </p>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>9. 아동의 개인정보 보호</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                회사는 만 14세 미만의 아동으로부터 정보를 수집하지 않습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-sky-600" />
                10. 개인정보 보호책임자
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="text-gray-700 space-y-2">
                <li><strong>이름:</strong> 개인정보 보호책임자</li>
                <li>
                  <strong>문의:</strong>{" "}
                  <a 
                    href="https://www.instagram.com/outoftoday_official/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sky-600 underline hover:text-sky-800"
                  >
                    @outoftoday_official
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>11. 개인정보처리방침 변경</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                정책 변경 시 최소 7일 전 공지 후 적용합니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>본 개인정보처리방침은 2025년 11월 15일부터 시행됩니다.</p>
        </div>
      </div>
    </div>
  )
}
