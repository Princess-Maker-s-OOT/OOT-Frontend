import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import MarketplaceHeader from "@/components/marketplace-header"
import MarketplaceFooter from "@/components/marketplace-footer"
import "@/app/globals.css"

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
      <body className={`${inter.className} flex min-h-screen flex-col bg-background font-sans antialiased text-foreground`}>
        {/* <MarketplaceHeader /> */}

        {/* ✅ 사이드바 제거된 콘텐츠 영역 */}
        <main className="flex-1 px-6 py-4">{children}</main>

        {/* <MarketplaceFooter /> */}
        <Analytics />
      </body>
    </html>
  )
}
