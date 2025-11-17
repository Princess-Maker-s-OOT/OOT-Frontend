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
    <main className="min-h-[480px] flex flex-col items-center font-sans justify-center">
      {/* 대형 브랜드 헤더 */}
      <header className="w-full flex flex-row items-center justify-end px-4 py-2 mb-1 bg-[#e3f2fd]">
        {/* 헤더만, 로고/네비 제거 */}
      </header>

      {/* 트렌디 슬로건 & 환경 메시지 */}
      <section className="w-full flex flex-row items-center px-4 py-2 mb-2 bg-[#e3f2fd]">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">오늘의 옷, 오늘의 가치</h1>
          <p className="text-lg text-gray-600 font-light">패션의 순환, 환경을 생각하는 OOT 중고마켓</p>
        </div>
      </section>

      {/* 메인 마켓/옷장 카드 섹션 */}
      <section className="w-full flex flex-row gap-4 px-4 mb-0 bg-[#e3f2fd] pb-4">
        {/* 중고마켓 카드 (판매글 목록으로 이동) */}
        <a href="/sale-posts" className="flex-1 rounded-2xl p-6 flex flex-col justify-between border border-sky-100 cursor-pointer bg-[#bbdefb] shadow-[0_4px_16px_0_rgba(33,150,243,0.10),0_1.5px_4px_0_rgba(33,150,243,0.18)] hover:shadow-[0_8px_24px_0_rgba(33,150,243,0.18),0_2px_8px_0_rgba(33,150,243,0.25)] hover:scale-[1.03] transition">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OOT 중고마켓</h2>
            <p className="text-base text-gray-700 mb-4">오늘의 거래, 옷의 새로운 여정, 당신이 이어주세요</p>
          </div>
          <Image src="/메인2.png" alt="Market" width={320} height={160} className="rounded-xl object-cover" />
        </a>
        {/* 옷장 카드 (공개옷장 목록으로 이동) */}
        <a href="/closets/public" className="flex-1 rounded-2xl p-6 flex flex-col justify-between border border-sky-100 cursor-pointer bg-[#b3e5fc] shadow-[0_4px_16px_0_rgba(33,150,243,0.10),0_1.5px_4px_0_rgba(33,150,243,0.18)] hover:shadow-[0_8px_24px_0_rgba(33,150,243,0.18),0_2px_8px_0_rgba(33,150,243,0.25)] hover:scale-[1.03] transition">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">OOT 옷장</h2>
            <p className="text-base text-gray-700 mb-4">나만의 옷장, 셀럽/인플루언서의 리얼 데일리룩</p>
          </div>
          <Image src="/메인3.png" alt="Closet" width={320} height={160} className="rounded-xl object-cover" />
        </a>
      </section>

      {/* 하단 멘트 */}
      <section className="w-full flex justify-center items-center py-2 mb-1 bg-[#e3f2fd]">
        <span className="text-base font-semibold text-gray-700">옷의 새로운 여정, 오늘 당신이 이어주세요.</span>
      </section>

      {/* 푸터 */}
      <footer className="w-full py-2 text-center text-gray-400 text-xs border-t border-gray-200 mt-0 bg-white">
        &copy; 2025 OOT. 패션과 환경을 생각하는 중고마켓 | Designed by Princess Alexa
      </footer>
    </main>
  )
}