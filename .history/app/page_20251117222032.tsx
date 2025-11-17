"use client"

import Image from "next/image"

export default function Home() {
  const photoItems = [
    { src: "/메인1.png", alt: "Main 1" },
    { src: "/메인2.png", alt: "Main 2" },
    { src: "/메인3.png", alt: "Main 3" },
    { src: "/메인4.png", alt: "Main 4" },
    { src: "/메인5.png", alt: "Main 5" },
  ]

  const colorSwatches = [
    "#000000", "#1A2A4F", "#5A1A2F", "#D8CBB3", "#5A6A4F",
    "#D8D8D8", "#CFE4F2", "#FFFFFF", "#F8D8E0", "#EAEAEA",
  ]

  return (
    <main className="min-h-screen bg-[#e3f2fd] flex flex-col items-center font-sans">
      {/* 대형 브랜드 헤더 */}
      <header className="w-full flex flex-row items-center justify-end px-16 py-10 mb-2">
        {/* 헤더만, 로고/네비 제거 */}
      </header>

      {/* 트렌디 슬로건 & 환경 메시지 */}
      <section className="w-full flex flex-row items-center px-16 py-8 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">오늘의 옷, 오늘의 가치</h1>
          <p className="text-lg text-gray-600 font-light">패션의 순환, 환경을 생각하는 OOT 리커머스</p>
        </div>
      </section>

      {/* 메인 마켓/옷장 카드 섹션 */}
      <section className="w-full flex flex-row gap-8 px-16 mb-16">
        {/* 마켓 카드 */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OOT 중고마켓</h2>
            <p className="text-base text-gray-600 mb-4">오늘의 거래, 옷의 새로운 여정, 당신이 이어주세요</p>
          </div>
          <Image src="/메인2.png" alt="Market" width={320} height={160} className="rounded-xl object-cover" />
        </div>
        {/* 옷장 카드 */}
        <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 flex flex-col justify-between hover:scale-[1.02] transition border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OOT 옷장</h2>
            <p className="text-base text-gray-600 mb-4">나만의 옷장, 셀럽/인플루언서의 리얼 데일리룩</p>
          </div>
          <Image src="/메인3.png" alt="Closet" width={320} height={160} className="rounded-xl object-cover" />
        </div>
      </section>

      {/* 트렌디 포토라인 & 여백 활용 */}
      <section className="w-full max-w-6xl px-16 py-8 flex flex-row gap-8 justify-center items-center">
        {photoItems.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <Image src={item.src} alt={item.alt} width={120} height={120} className="object-cover rounded-xl shadow-lg mb-2" />
            <span className="text-xs text-gray-500">#{item.alt}</span>
          </div>
        ))}
      </section>

      {/* 푸터 */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-200 mt-16">
        &copy; 2025 OOT. 패션과 환경을 생각하는 리커머스 | Designed by Princess Alexa
      </footer>
    </main>
  )
}