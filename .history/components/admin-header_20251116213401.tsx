"use client"

import { Search, LogOut, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { logout } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export default function AdminHeader() {
  const router = useRouter()
  const [nickname, setNickname] = useState<string>("")

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfo = localStorage.getItem("userInfo")
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo)
        setNickname(parsed.nickname || "관리자")
      } catch {
        setNickname("관리자")
      }
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("userInfo")
      window.dispatchEvent(new Event("authStateChanged"))
      router.push("/login")
    } catch (err) {
      console.error("로그아웃 실패:", err)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 왼쪽: 로고 & 네비게이션 */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-purple-600 font-bold">
              A
            </div>
            <span className="text-xl font-bold">OOT 관리자</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-white/10 transition"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">대시보드</span>
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-2 rounded-md hover:bg-white/10 transition text-sm font-medium"
            >
              회원관리
            </Link>
            <Link
              href="/admin/sale-posts"
              className="px-3 py-2 rounded-md hover:bg-white/10 transition text-sm font-medium"
            >
              판매글관리
            </Link>
            <Link
              href="/admin/categories"
              className="px-3 py-2 rounded-md hover:bg-white/10 transition text-sm font-medium"
            >
              카테고리관리
            </Link>
          </nav>
        </div>

        {/* 오른쪽: 사용자 정보 & 액션 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden md:block">
            {nickname}님 (관리자)
          </span>

          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              일반 모드로
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-1" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  )
}
