import { MapPin, Shield, Eye, Clock, AlertCircle, Scale, FileText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LocationTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <MapPin className="h-16 w-16 text-sky-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            위치기반 서비스 이용약관
          </h1>
          <p className="text-lg text-gray-600">Location-Based Service Terms</p>
          <p className="text-sm text-gray-500 mt-2">최종 업데이트: 2025년 11월 15일</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">
              본 위치기반 서비스 이용약관(이하 "약관")은{" "}
              <strong className="text-sky-600">OOT(Outfit Of Today)</strong>(이하 "회사")가 제공하는 
              위치기반 서비스(이하 "서비스") 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임 사항을 
              규정함을 목적으로 합니다.
            </p>
          </CardContent>
        </Card>

        {/* 제1조: 목적 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>제1조 (목적)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700">
              본 약관은 회사가 제공하는 위치정보 기반 기부처 검색 및 지도 서비스 등 위치정보를 활용한 
              서비스 이용에 관한 회사와 이용자 간의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
            </p>
          </CardContent>
        </Card>

        {/* 제2조: 용어의 정의 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>제2조 (용어의 정의)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ol className="space-y-3 text-gray-700">
              <li>
                <strong>"위치정보"</strong>란 개인 또는 기기의 위치에 관한 정보로서 
                전기통신설비 및 전파를 이용하여 수집된 것을 말합니다.
              </li>
              <li>
                <strong>"개인위치정보"</strong>란 위치정보 중 특정 개인을 식별할 수 있는 정보를 말합니다.
              </li>
              <li>
                <strong>"서비스"</strong>란 회사가 카카오맵(Local API) 등을 활용하여 제공하는 
                위치 기반 기부처 검색, 지도 표시 등을 의미합니다.
              </li>
              <li>
                <strong>"이용자"</strong>란 본 약관에 동의하고 서비스를 이용하는 회원 또는 비회원을 말합니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* 제3조: 약관의 효력 및 변경 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-sky-600" />
              제3조 (약관의 효력 및 변경)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>본 약관은 서비스 내 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 필요 시 관련 법령을 위반하지 않는 범위에서 본 약관을 개정할 수 있습니다.</li>
              <li>약관이 변경될 경우 변경 사항은 시행 7일 전 서비스 내 공지를 통해 안내합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</li>
            </ol>
          </CardContent>
        </Card>

        {/* 제4조: 위치정보의 수집 및 이용 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-sky-600" />
              제4조 (위치정보의 수집 및 이용)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-3">
              회사는 다음과 같은 목적 하에서 이용자의 위치정보를 수집하거나 활용할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>기부처, 판매 장소 등 주변 장소 검색 기능 제공</li>
              <li>지도의 위치 표시 및 반경 기반 검색 결과 제공</li>
              <li>주소 기반 검색, 좌표 변환 및 위치 정보 기반 서비스 품질 향상</li>
              <li>서비스 이용 과정에서 발생한 오류 분석 및 개선</li>
            </ol>
            <div className="mt-4 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm text-gray-700">
                <strong>※ 중요:</strong> 회사는 이용자의 GPS 정보를 저장하지 않으며, 
                단순 검색/표시를 위해서만 활용합니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 제5조: 보유 및 이용 기간 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-sky-600" />
              제5조 (개인위치정보의 보유 및 이용 기간)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>회사는 개인위치정보를 저장하지 않으며, 서비스 제공을 위한 처리 후 즉시 파기합니다.</li>
              <li>단, 이용자가 검색한 주소 또는 선택한 위치 정보는 개인식별이 불가능한 형태로 처리됩니다.</li>
            </ol>
          </CardContent>
        </Card>

        {/* 제6조: 이용자의 권리 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-sky-600" />
              제6조 (개인위치정보주체의 권리)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-3">이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 ml-4">
              <li>개인위치정보 수집·이용·제공에 대한 동의 철회</li>
              <li>개인위치정보 이용 목적 및 제공 내용 열람</li>
              <li>오류가 있을 경우 정정 요구</li>
              <li>개인위치정보 삭제 요구</li>
              <li>위치정보 서비스 일시 중지 및 종료 요청</li>
            </ol>
            <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <p className="text-sm text-gray-700">
                요청은 아래의 문의처를 통해 접수할 수 있습니다.<br />
                <strong className="text-sky-600">문의: contact@oot.today</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 제7조: 확인자료 보유 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-600" />
              제7조 (위치정보 이용·제공 사실 확인자료 보유)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700">
              회사는 「위치정보의 보호 및 이용 등에 관한 법률」에 따라 
              위치정보 이용·제공 사실 확인 자료를 <strong className="text-sky-600">6개월간</strong> 보관할 수 있습니다.
              단, 회사는 개인을 특정할 수 있는 위치 정보를 별도로 보관하지 않습니다.
            </p>
          </CardContent>
        </Card>

        {/* 제8조: 제3자 제공 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>제8조 (위치정보의 제3자 제공)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
              <li>회사는 이용자의 개인위치정보를 제3자에게 제공하지 않습니다.</li>
              <li>단, 법령에 의한 요청이 있는 경우에 한해 제공할 수 있습니다.</li>
              <li>
                서비스 제공 과정에서 카카오맵(Local API)에 위치 정보가 전달될 수 있으나,
                이는 검색 처리 목적으로만 사용되며 회사는 해당 정보를 저장하지 않습니다.
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* 제9-13조: 나머지 섹션들 */}
        <div className="space-y-8">
          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-sky-600" />
                제9조 (서비스의 변경 및 중단)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>회사는 서비스 품질 향상 또는 운영상의 필요에 따라 위치기반 서비스의 전부 또는 일부를 변경할 수 있습니다.</li>
                <li>서비스 변경 시 사전 공지를 원칙으로 합니다.</li>
                <li>
                  회사는 다음과 같은 경우 사전 공지 없이 서비스 제공을 중단할 수 있습니다.
                  <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                    <li>시스템 점검 또는 장애 발생</li>
                    <li>천재지변 등 불가항력</li>
                    <li>법령 또는 정부 기관의 요청</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>제10조 (손해배상)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>회사는 고의 또는 중대한 과실이 없는 한 위치 기반 서비스 이용과 관련하여 발생한 손해에 대해 책임을 지지 않습니다.</li>
                <li>이용자가 본 약관을 위반하여 발생한 손해에 대해서는 이용자 본인에게 책임이 있습니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>제11조 (면책)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>
                  회사는 아래 사유로 인해 발생한 이용자의 손해에 대해 책임을 지지 않습니다.
                  <ul className="list-disc list-inside mt-2 ml-6 space-y-1">
                    <li>이용자의 기기 오류, 네트워크 장애</li>
                    <li>통신 사업자 또는 API 제공자의 장애</li>
                    <li>이용자의 잘못된 위치 설정 또는 정보 입력</li>
                  </ul>
                </li>
                <li>회사는 제3자 지도/위치 API(카카오맵 등)의 오류로 인한 책임을 부담하지 않습니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>제12조 (분쟁 해결 및 관할 법원)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li>회사와 이용자 간의 분쟁은 상호 협의를 통해 해결함을 원칙으로 합니다.</li>
                <li>협의가 이루어지지 않을 경우 회사의 본점 소재지를 관할하는 법원을 전속 관할로 합니다.</li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-sky-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
              <CardTitle>제13조 (개인위치정보 보호책임자)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 mb-3">
                회사는 위치정보를 보호하고 관리하기 위해 다음과 같이 위치정보 보호책임자를 지정합니다.
              </p>
              <ul className="text-gray-700 space-y-2">
                <li><strong>이름:</strong> 위치정보 보호책임자</li>
                <li><strong>이메일:</strong> contact@oot.today</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* 부칙 */}
        <Card className="mb-8 border-sky-100 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-50 to-cyan-50">
            <CardTitle>부칙</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700">
              본 약관은 <strong className="text-sky-600">2025년 11월 15일</strong>부터 시행합니다.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-lg border border-sky-200">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-700">
              위치기반 서비스 관련 문의
            </p>
            <p className="text-lg font-bold text-sky-600">
              contact@oot.today
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
