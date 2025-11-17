"use client"


import Image from "next/image"

export default function Home() {
  // 매거진 카드 데이터 예시
  const magazineItems = [
    {
      title: "OOT 매거진: 2025 F/W 트렌드",
      desc: "올해의 패션 키워드와 스타일링 팁을 한눈에!",
      img: "/메인1.png",
      link: "/magazine/2025-fw"
    },
    {
      title: "셀럽의 옷장 공개",
      desc: "인플루언서들의 리얼 데일리룩 & OOTD",
      img: "/메인2.png",
      link: "/magazine/celeb-closet"
    },
    {
      title: "지속가능 패션, 리커머스 스토리",
      desc: "옷의 새로운 여정, 당신이 이어가는 가치",
      img: "/메인3.png",
      link: "/magazine/sustainable"
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f8f8f8] via-[#eaeaea] to-[#fff] flex flex-col items-center font-sans">
      {/* 히어로 섹션 */}
      <section className="w-full relative h-[480px] flex items-center justify-center mb-12">
        <Image src="/oot-hero.jpg" alt="OOT Hero" fill priority className="object-cover brightness-90" />
        <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
          <Image src="/oot-logo.png" alt="OOT Logo" width={320} height={80} className="mb-6 drop-shadow-lg" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-xl">Outfit Of Today</h1>
          <p className="text-lg md:text-2xl text-white/80 font-light mb-2">패션의 새로운 여정, 오늘 당신이 이어주세요.</p>
          <span className="inline-block mt-4 px-6 py-2 bg-white/80 text-gray-900 font-semibold rounded-full shadow-lg text-base md:text-lg">#OOT #리커머스 #패션매거진</span>
        </div>
      </section>

      {/* 매거진 카드 섹션 */}
      <section className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {magazineItems.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className="group bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col hover:scale-[1.03] transition-transform duration-300 border border-gray-100"
          >
            <div className="relative w-full h-64">
              <Image src={item.img} alt={item.title} fill className="object-cover group-hover:brightness-95 transition duration-200" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-sky-700 transition">{item.title}</h2>
              <p className="text-base text-gray-600 mb-4">{item.desc}</p>
              <span className="text-xs text-sky-600 font-semibold group-hover:underline">자세히 보기 →</span>
            </div>
          </a>
        ))}
      </section>

      {/* 브랜드 컬러 스와치 & 슬로건 */}
      <section className="w-full max-w-5xl px-4 flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
        <div className="flex flex-row gap-2 md:gap-4">
          {['#000', '#1A2A4F', '#D8CBB3', '#5A6A4F', '#F8D8E0', '#CFE4F2', '#fff'].map((c, i) => (
            <span key={i} className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-200" style={{background: c}} />
          ))}
        </div>
        <div className="text-center md:text-right">
          <span className="text-lg md:text-2xl font-semibold text-gray-700">OOT는 패션의 가치와 스토리를 연결합니다.</span>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-200">
        &copy; 2025 OOT. All rights reserved. | Designed by Princess Alexa
      </footer>
    </main>
  )
}