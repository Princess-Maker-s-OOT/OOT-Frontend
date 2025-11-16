"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import MarketplaceHeader from "@/components/marketplace-header"
import AdminHeader from "@/components/admin-header"

export default function HeaderWrapper() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // 경로가 /admin으로 시작하는지 확인
    const isAdminPath = pathname?.startsWith("/admin")
    
    if (isAdminPath) {
      // 로컬 스토리지에서 사용자 정보 확인
      const userInfo = localStorage.getItem("userInfo")
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo)
          setIsAdmin(parsed.role === "ADMIN")
        } catch {
          setIsAdmin(false)
        }
      }
    } else {
      setIsAdmin(false)
    }
  }, [pathname])

  // 관리자 페이지이고 관리자 권한이 있으면 관리자 헤더 표시
  if (pathname?.startsWith("/admin") && isAdmin) {
    return <AdminHeader />
  }

  // 일반 사용자 헤더 표시
  return <MarketplaceHeader />
}
