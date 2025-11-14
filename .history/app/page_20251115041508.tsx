"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles, ShoppingBag, Layout, Recycle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const features = [
    {
      icon: Layout,
      title: "디지털 옷장 관리",
      description: "나의 모든 옷을 한눈에 정리하고 스마트하게 관리하세요",
      color: "from-sky-400 to-cyan-400"
    },
    {
      icon: ShoppingBag,
      title: "중고 거래 플랫폼",
      description: "안전하고 간편한 직거래로 새로운 옷과 만나보세요",
      color: "from-cyan-400 to-blue-400"
    },
    {
      icon: Sparkles,
      title: "스마트 추천",
      description: "안 입는 옷을 AI가 분석하여 판매/기부를 추천해드려요",
      color: "from-blue-400 to-indigo-400"
    },
    {
      icon: Recycle,
      title: "지속 가능한 패션",
      description: "옷의 재사용으로 환경을 지키는 작은 실천에 동참하세요",
      color: "from-green-400 to-emerald-400"
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 via-transparent to-cyan-100/50 pointer-events-none" />
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/oot-logo.png"
                alt="O.O.T Logo"
                width={400}
                height={120}
                className="mx-auto"
                priority
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              오늘의 옷, 오늘의 거래
            </h1>
            <p className="text-2xl md:text-3xl text-sky-700 font-medium mb-8">
              옷의 새로운 여정, 오늘 당신이 이어주세요
            </p>
            
            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto mb-12">
              <strong className="text-sky-600">OOT</strong>는 디지털 옷장 관리와 중고 거래가 결합된 
              새로운 패션 플랫폼입니다. 옷장을 정리하고, 안 입는 옷은 판매하거나 기부하세요.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-sky-500 text-sky-600 hover:bg-sky-50 text-lg px-8 py-6 rounded-full"
                >
                  자세히 알아보기
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Showcase */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
              {["/메인1.png", "/메인2.png", "/메인3.png", "/메인4.png", "/메인5.png"].map((src, idx) => (
                <div 
                  key={idx}
                  className={`relative group ${idx % 2 === 1 ? 'md:mt-8' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-200/30 to-cyan-200/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative overflow-hidden rounded-2xl shadow-xl group-hover:shadow-2xl transition-all">
                    <Image
                      src={src}
                      alt={`Style ${idx + 1}`}
                      width={240}
                      height={240}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              OOT의 핵심 기능
            </h2>
            <p className="text-lg text-gray-600">
              디지털 옷장 관리부터 친환경 거래까지, 모든 것이 한곳에
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, idx) => (
              <Card 
                key={idx}
                className="border-0 bg-gradient-to-br from-white to-sky-50 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-sky-100 text-lg">활성 사용자</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5000+</div>
              <div className="text-sky-100 text-lg">등록된 옷</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">3000+</div>
              <div className="text-sky-100 text-lg">성공한 거래</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-16 w-16 text-sky-500 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              무료 회원가입하고 나만의 디지털 옷장을 만들어보세요
            </p>
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                회원가입하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}