import { FileText, Scale, Shield, AlertTriangle, Users, CreditCard, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-sky-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            이용약관
          </h1>
          <p className="text-lg text-gray-600">Terms of Service</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2025년 11월 15일</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">
              본 이용약관(이하 "약관")은 <strong className="text-sky-600">OOT(Outfit Of Today)</strong>(이하 "회사")가 
              제공하는 모든 서비스 이용 조건을 규정합니다.
              서비스 이용자는 본 약관에 동의한 것으로 간주됩니다.
            </p>
          </CardContent>
        </Card>

        {/* 1. 목적 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>1. 목적</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700">
              이 약관은 회사가 제공하는 디지털 옷장 관리·중고거래·추천 서비스 및 기타 부가서비스 이용에 
              관한 권리, 의무 및 책임 사항을 규정합니다.
            </p>
          </CardContent>
        </Card>

        {/* 2. 용어 정의 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>2. 용어 정의</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-2 text-gray-700">
              <li><strong>"서비스":</strong> OOT 플랫폼에서 제공하는 모든 기능</li>
              <li><strong>"회원":</strong> OOT에 가입하여 서비스를 이용하는 자</li>
              <li><strong>"비회원":</strong> 가입하지 않고 서비스를 일부 이용하는 자</li>
              <li><strong>"게시물":</strong> 이미지, 텍스트 등 회원이 서비스에 게시한 모든 자료</li>
              <li><strong>"거래":</strong> 회원 간 중고 의류 판매·구매 활동</li>
            </ul>
          </CardContent>
        </Card>

        {/* 3. 약관의 효력 및 변경 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-sky-600" />
              3. 약관의 효력 및 변경
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>본 약관은 서비스 내 공지 후 적용됩니다.</li>
              <li>회사는 필요한 경우 약관을 변경할 수 있으며, 변경 시 최소 7일 이상의 사전 공지를 합니다.</li>
              <li>회원은 변경 약관에 동의하지 않는 경우 탈퇴할 수 있습니다.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 4. 서비스의 제공 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>4. 서비스의 제공</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-3">회사는 다음 기능을 제공합니다:</p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>디지털 옷장 관리</li>
              <li>옷 착용 기록 관리</li>
              <li>미착용 옷 기부/판매 추천</li>
              <li>중고거래 게시판 및 직거래 기능</li>
              <li>기부처 검색(카카오맵 기반)</li>
              <li>결제 기능(토스페이먼츠 사용)</li>
              <li>기타 회사가 정하는 기능</li>
            </ol>
          </CardContent>
        </Card>

        {/* 5. 서비스의 중단 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-sky-600" />
              5. 서비스의 중단
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>시스템 점검, 서버 장애, 천재지변 등 불가피한 경우 서비스가 일시 중단될 수 있습니다.</li>
              <li>회사는 서비스 장애로 인해 발생한 이용자의 손해에 대해 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 6. 회원 가입 및 계정 관리 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-sky-600" />
              6. 회원 가입 및 계정 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>로그인은 구글 OAuth로 이루어집니다.</li>
              <li>회원은 계정 정보를 올바르게 관리해야 하며, 타인에게 양도할 수 없습니다.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 7. 회원의 의무 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-600" />
              7. 회원의 의무
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-3">회원은 다음 행위를 해서는 안 됩니다:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>타인의 계정 도용</li>
              <li>허위 정보 등록</li>
              <li>저작권 및 타인의 권리를 침해하는 게시물 업로드</li>
              <li>불법 물품 또는 위조품 판매</li>
              <li>사기, 악성 거래 등 부정 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
            </ul>
          </CardContent>
        </Card>

        {/* 8. 게시물의 관리 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-sky-600" />
              8. 게시물의 관리
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>회원이 작성한 게시물의 책임은 회원 본인에게 있습니다.</li>
              <li>저작권 침해, 불법 게시물 등 문제가 있는 경우 회사는 게시물을 숨김·삭제할 수 있습니다.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 9. 거래 및 결제 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-sky-600" />
              9. 거래 및 결제
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>회사는 중개 플랫폼이며 거래 당사자가 아닙니다.</li>
              <li>모든 직거래에서 발생하는 책임은 거래 당사자에게 있습니다.</li>
              <li>결제는 토스페이먼츠를 사용하며, 전자금융거래법을 준수합니다.</li>
              <li>환불/취소는 PG사 규정 및 서비스 내 정책을 따릅니다.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 10-13: 나머지 섹션들 */}
        <div className="space-y-8">
          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>10. 서비스 이용 제한</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-3">회원이 다음에 해당하는 경우 서비스 이용을 제한할 수 있습니다:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>약관 위반</li>
                <li>불법 게시물 또는 사기 행위</li>
                <li>개인정보 도용 시도</li>
                <li>반복적인 신고 누적</li>
                <li>기타 서비스 운영을 저해하는 활동</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>11. 손해배상</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>회사는 고의 또는 중대한 과실이 없는 한 서비스 이용 과정에서 발생한 손해에 대해 책임을 지지 않습니다.</li>
                <li>회원 간 거래 분쟁에 관하여 회사는 책임을 지지 않습니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>12. 분쟁 해결</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>분쟁 발생 시 회사는 신속한 처리를 위해 노력합니다.</li>
                <li>법적 분쟁이 발생하는 경우 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>13. 부칙</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700">
                본 약관은 <strong className="text-sky-600">2025년 11월 15일</strong>부터 적용됩니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 p-6 bg-sky-50 rounded-lg border border-sky-200">
          <p className="text-center text-sm text-gray-700">
            문의사항이 있으시면{" "}
            <a 
              href="https://www.instagram.com/outoftoday_official/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-600 font-bold underline hover:text-sky-800"
            >
              @outoftoday_official
            </a>
            {" "}로 연락 주시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  )
}
