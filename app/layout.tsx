import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "@/app/globals.css"
import HeaderWrapper from "@/components/header-wrapper"
import MarketplaceFooter from "@/components/marketplace-footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 카카오맵 API 스크립트 */}
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY}&libraries=services&autoload=false`}
          async
        />
      </head>
      <body className={`${inter.className} flex min-h-screen flex-col bg-background font-sans antialiased text-foreground`}>
        <HeaderWrapper />

        {/* ✅ 사이드바 제거된 콘텐츠 영역 */}
        <main className="flex-1 px-6 py-4">{children}</main>

        <MarketplaceFooter />
        <Analytics />
      </body>
    </html>
  )
}
