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
    <main className="min-h-[700px] bg-oot-sky-100 flex flex-col items-center font-sans justify-center text-center py-8">
      {/* 대형 브랜드 헤더 */}
      <header className="w-full flex flex-row items-center justify-center px-4 py-2 mb-1">
        {/* 헤더만, 로고/네비 제거 */}
      </header>

      {/* 트렌디 슬로건 & 환경 메시지 */}
      <section className="w-full flex flex-col items-center justify-center px-4 py-2 mb-2">
        <h1 className="text-5xl font-extrabold text-[#1A2A4F] mb-2 tracking-tight drop-shadow-lg font-sans">오늘의 옷, 오늘의 가치</h1>
        <p className="text-xl font-medium text-[#1976d2] mb-1 font-sans">패션의 순환, 환경을 생각하는 <span className='font-bold text-[#1A2A4F]'>OOT 마켓</span></p>
      </section>

      {/* 메인 마켓/옷장 카드 섹션 */}
      <section className="w-full flex flex-row gap-6 px-4 mb-4 justify-center items-center">
        {/* 중고마켓 카드 (판매글 목록으로 이동) */}
        <a href="/sale-posts" className="flex flex-row items-center justify-center hover:scale-[1.04] transition cursor-pointer" style={{maxWidth: '520px'}}>
          <div className="flex flex-row items-center bg-white rounded-2xl shadow-xl p-0" style={{height: '360px', width: '520px'}}>
            <div style={{width: '260px', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Image src="/메인2.png" alt="Market" width={220} height={320} className="rounded-l-2xl object-cover" style={{width: '220px', height: '320px'}} />
            </div>
            <div className="flex flex-col items-center justify-center text-center" style={{width: '260px', height: '360px'}}>
              <h2 className="text-3xl font-extrabold text-[#1A2A4F] mb-2 font-sans drop-shadow">OOT 마켓</h2>
              <p className="text-xl text-[#1976d2] mb-3 font-medium font-sans">
                오늘의 거래, 환경 보호<br />
                <span className="text-[#1A2A4F] font-bold">가치의 순환</span><br />
              </p>
            </div>
          </div>
        </a>
        {/* 옷장 카드 (공개옷장 목록으로 이동) */}
        <a href="/closets/public" className="flex flex-row items-center justify-center hover:scale-[1.04] transition cursor-pointer" style={{maxWidth: '520px'}}>
          <div className="flex flex-row items-center bg-white rounded-2xl shadow-xl p-0" style={{height: '360px', width: '520px'}}>
            <div style={{width: '260px', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Image src="/메인3.png" alt="Closet" width={220} height={320} className="rounded-l-2xl object-cover" style={{width: '220px', height: '320px'}} />
            </div>
            <div className="flex flex-col items-center justify-center text-center" style={{width: '260px', height: '360px'}}>
              <h2 className="text-3xl font-extrabold text-[#1A2A4F] mb-2 font-sans drop-shadow">OOT 옷장</h2>
              <p className="text-xl text-[#1976d2] mb-3 font-medium font-sans">
                나만의 옷장, 셀럽/인플루언서<br />
                <span className="text-[#1A2A4F] font-bold">리얼 데일리룩</span>
              </p>
            </div>
          </div>
        </a>
      </section>

      {/* 하단 멘트 */}
      <section className="w-full flex justify-center items-center py-2 mb-1 text-center">
        <span className="text-lg font-bold text-[#1A2A4F] font-sans drop-shadow">옷의 새로운 여정, 오늘 당신이 이어주세요.</span>
      </section>

      {/* 푸터 */}
      <footer className="w-full py-2 text-center text-gray-400 text-xs border-t border-gray-200 mt-1">
        &copy; 2025 OOT. 패션과 환경을 생각하는 중고마켓 | Designed by Princess Alexa
      </footer>
    </main>
  )
}