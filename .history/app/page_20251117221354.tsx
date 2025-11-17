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
    <main className="min-h-screen bg-white px-6 py-6 flex flex-col items-center">
      {/* ✅ O.O.T 이미지 로고 */}
      <div className="mb-4">
        <Image
          src="/oot-logo.png"
          alt="O.O.T Logo"
          width={600}
          height={200}
          className="mx-auto"
          priority
        />
      </div>

      {/* ✅ 중앙 텍스트 추가 */}
      <div className="text-center font-bold text-lg mb-2 font-cute">
        오늘의 옷, 오늘의 거래
      </div>
      <div className="text-center font-bold text-base mb-6 text-gray-700 font-cute">
        옷의 새로운 여정, 오늘 당신이 이어주세요.
      </div>

      {/* 헤더 라인 */}
      <div className="flex justify-between w-full max-w-4xl mb-4 text-sm text-gray-700">
        <span>Outfit Of Today</span>
        <span>@princessalexar</span>
      </div>

      {/* ✅ Photo Line */}
      <div className="w-full max-w-4xl border-t border-gray-300 pt-10 mt-8 mb-0">
        <div className="grid grid-cols-5 grid-rows-2 gap-4 mt-6">
          {/* 1번 */}
          <div className="flex flex-col items-center col-start-1 row-start-1">
            <Image src="/메인1.png" alt="Main 1" width={160} height={160} className="object-cover rounded shadow-md w-[160px] h-[160px]" />
          </div>
          {/* 2번 → 아래 줄 + 하단 여백 제거 */}
          <div className="flex flex-col items-center col-start-2 row-start-2 mb-0">
            <Image src="/메인2.png" alt="Main 2" width={160} height={160} className="object-cover rounded shadow-md w-[160px] h-[160px]" />
          </div>
          {/* 3번 */}
          <div className="flex flex-col items-center col-start-3 row-start-1">
            <Image src="/메인3.png" alt="Main 3" width={160} height={160} className="object-cover rounded shadow-md w-[160px] h-[160px]" />
          </div>
          {/* 4번 → 아래 줄 + 하단 여백 제거 */}
          <div className="flex flex-col items-center col-start-4 row-start-2 mb-0">
            <Image src="/메인4.png" alt="Main 4" width={160} height={160} className="object-cover rounded shadow-md w-[160px] h-[160px]" />
          </div>
          {/* 5번 */}
          <div className="flex flex-col items-center col-start-5 row-start-1">
            <Image src="/메인5.png" alt="Main 5" width={160} height={160} className="object-cover rounded shadow-md w-[160px] h-[160px]" />
          </div>
        </div>
      </div>
    </main>
  )
}