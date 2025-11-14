"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"

export default function MarketplaceFooter() {
  const currentYear = new Date().getFullYear()

  const links = [
    { title: "About Us", href: "/about" },
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Location-Based Service Terms", href: "/location-terms" },
  ]

  return (
    // ✅ Sky Blue 테마 적용: border-t border-sky-200
    <footer className="mt-16 border-t border-sky-200 bg-gray-50/50 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        
        {/* 상단 섹션: 로고 및 링크 */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          
          {/* 로고/브랜드 정보 */}
          <div className="space-y-2">
            <h3 className="logo-fluffy text-3xl font-extrabold text-sky-600">O.O.T</h3>
            <p className="text-sm text-gray-600 max-w-md">
              디지털 옷장 관리 서비스 기반의
              <strong className="text-foreground ml-1">의류 중고 거래 플랫폼</strong>
            </p>
            <p className="text-xs text-gray-400">사용자의 옷장을 스마트하게 관리하고, 안전하고 간편한 거래 경험을 제공합니다.</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-sky-600 transition-colors whitespace-nowrap"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} O.O.T Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
