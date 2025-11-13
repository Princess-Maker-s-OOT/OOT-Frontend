"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import CategorySidebar from "@/components/category-sidebar"
import { getMockCategories } from "@/lib/mock/category" // ✅ 경로 수정

export default function MarketplaceHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const categories = getMockCategories()

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    setIsLoggedIn(!!token)
  }, [])

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto"
  }, [sidebarOpen])

  // 로그아웃 처리
  function handleLogout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    location.reload()
  }

  return (
    <>
      {/* ✅ 헤더 - 연한 파스텔 하늘색 테마 적용 */}
      <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-oot-sky-50 via-white to-oot-sky-100 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-oot-sky-200 shadow-sm">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            
            {/* LEFT: logo + nav */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/oot-logo.png"
                  alt="OOT"
                  width={100}
                  height={40}
                  className="object-contain"
                  priority
                />
              </Link>

              <nav className="hidden md:flex items-center gap-4">
                <Link href="/sale-posts">
                  <Button variant="ghost" className="text-sm font-semibold text-oot-sky-accent hover:text-sky-700 hover:bg-oot-sky-100">
                    Marketplace
                  </Button>
                </Link>

                <Link href="/donation-centers/search">
                  <Button
                    variant="ghost"
                    className="text-sm font-semibold text-oot-sky-accent hover:text-sky-700 hover:bg-oot-sky-100"
                  >
                    Donation
                  </Button>
                </Link>

                {/* ✅ Category 토글 버튼 */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm border-oot-sky-accent text-oot-sky-accent hover:bg-oot-sky-100 font-semibold"
                  onClick={() => setSidebarOpen((prev) => !prev)}
                >
                  Category
                </Button>
              </nav>
            </div>

            {/* RIGHT: actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-oot-sky-accent hover:text-sky-700 hover:bg-oot-sky-100">
                <Search className="h-5 w-5" />
              </Button>

              {/* My Page always visible */}
              <Link href="/my">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex text-oot-sky-accent hover:text-sky-700 hover:bg-oot-sky-100">
                  My Page
                </Button>
              </Link>

                            {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-oot-sky-accent text-oot-sky-accent hover:bg-oot-sky-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-oot-sky-accent hover:text-sky-700 hover:bg-oot-sky-100">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="default" size="sm" className="bg-oot-sky-accent text-white text-sm font-semibold hover:bg-sky-600">
                      SignUp
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ✅ 슬라이드 사이드바 - 파스텔 하늘색 */}
      <div
        className={`fixed top-0 left-0 h-full w-52 bg-gradient-to-b from-oot-sky-50 to-oot-sky-100 shadow-lg z-50 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-oot-sky-200">
          <h2 className="text-base font-semibold text-oot-sky-accent">Category</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-sm text-gray-500 hover:text-oot-sky-accent"
          >
            Close
          </button>
        </div>
        <CategorySidebar
          categories={categories}
          onSelect={(id) => {
            setSidebarOpen(false)
            // router.push(`/sale-posts?categoryId=${id}`) 가능
          }}
        />
      </div>
    </>
  )
}