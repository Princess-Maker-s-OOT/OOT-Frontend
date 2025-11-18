import Image from "next/image"
import { Sparkles, Users, Recycle, ShoppingBag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  const features = [
    {
      icon: Users,
      title: "회원 기반 서비스",
      description: "옷장 관리, 중고 거래는 회원 전용 기능입니다.",
    },
    {
      icon: ShoppingBag,
      title: "비회원 접근",
      description: "공개 옷장 및 중고 거래 게시물 조회는 비회원도 가능합니다.",
    },
    {
      icon: Recycle,
      title: "직거래 기반",
      description: "모든 중고 거래는 사용자 간의 직거래를 기본으로 합니다.",
    },
    {
      icon: Sparkles,
      title: "독립적 거래",
      description: "옷장 서비스를 이용하지 않는 회원도 판매 및 구매 활동에 참여할 수 있습니다.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-cyan-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200/30 via-cyan-200/20 to-blue-200/30" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* 왼쪽: 텍스트 콘텐츠 */}
            <div className="space-y-6">
              <div className="inline-block">
                <div className="logo-fluffy text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600">
                  OOT
                </div>
                <p className="text-sm md:text-base text-gray-600 mt-2 tracking-wider">
                  Outfit of Today
                </p>
              </div>

              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  오늘의 옷, 오늘의 거래
                </h1>
                <p className="text-xl md:text-2xl text-sky-700 font-medium">
                  옷의 새로운 여정, 오늘 당신이 이어주세요
                </p>
              </div>

              <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                <strong className="text-sky-600">OOT</strong> 플랫폼은 의류 기반 중고 거래 플랫폼이자 사용자의 디지털 옷장 관리를 제공하며,<br/>
                자주 안 입는 옷에 대해 기부 또는 판매를 추천하여 옷의 활용도를 높이고,<br/>
                의류 순환을 통해 환경 보호에 앞장섭니다.
              </p>
            </div>

            {/* 오른쪽: 3D 일러스트 이미지 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-300/20 to-blue-300/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-sky-200/50">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src="/옷의 새로운 여정, 오늘 당신이 이어주세요.png"
                    alt="OOT - Outfit of Today"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              
              {/* 떠다니는 옷걸이 장식 요소 */}
              <div className="absolute -top-8 -left-8 w-20 h-20 text-sky-400/30">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M20,30 Q50,20 80,30 L80,35 Q50,25 20,35 Z" />
                  <rect x="48" y="35" width="4" height="10" />
                  <circle cx="50" cy="25" r="5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            주요 특징
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 mx-auto rounded-full" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-sky-100 bg-white/60 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-cyan-400 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="border-0 bg-gradient-to-r from-sky-100 via-cyan-100 to-blue-100 shadow-2xl">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <Sparkles className="h-12 w-12 text-sky-600 mx-auto" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              지속 가능한 패션을 향한 여정
            </h2>
            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              OOT는 단순한 중고 거래 플랫폼을 넘어, 옷의 생명을 연장하고 지속 가능한 소비 문화를 만들어갑니다.<br/>
              당신의 옷장에서 시작되는 작은 변화가 환경을 지키는 큰 움직임이 됩니다.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-sky-200">
                <p className="text-sm font-medium text-sky-700">♻️ 의류 재사용</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-cyan-200">
                <p className="text-sm font-medium text-cyan-700">🌍 환경 보호</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200">
                <p className="text-sm font-medium text-blue-700">💚 지속 가능성</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            오늘부터 시작하세요
          </h2>
          <p className="text-lg text-gray-600">
            당신의 옷장을 정리하고, 새로운 옷을 만나보세요
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/signup"
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-full font-medium hover:from-sky-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
            >
              회원가입하기
            </a>
            <a
              href="/closets"
              className="px-8 py-3 bg-white text-sky-600 rounded-full font-medium border-2 border-sky-500 hover:bg-sky-50 transition-all shadow-md hover:shadow-lg"
            >
              둘러보기
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
