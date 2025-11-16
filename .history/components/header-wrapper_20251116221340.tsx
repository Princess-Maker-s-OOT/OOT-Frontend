"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import MarketplaceHeader from "@/components/marketplace-header"
import AdminHeader from "@/components/admin-header"

export default function HeaderWrapper() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 확인
    const checkAdminStatus = () => {
      const userInfo = localStorage.getItem("userInfo")
      const accessToken = localStorage.getItem("accessToken")
      
      console.log("HeaderWrapper - 권한 체크:", { 
        pathname, 
        hasUserInfo: !!userInfo,
        hasToken: !!accessToken
      })
      
      if (userInfo) {
        try {
          const parsed = JSON.parse(userInfo)
          console.log("HeaderWrapper - 사용자 정보:", { 
            loginId: parsed.loginId, 
            role: parsed.role 
          })
          setIsAdmin(parsed.role === "ADMIN")
        } catch (err) {
          console.error("HeaderWrapper - JSON 파싱 실패:", err)
          setIsAdmin(false)
        }
      } else if (accessToken) {
        // userInfo가 없어도 JWT에서 확인
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]))
          const isAdminUser = payload.userRole === "ADMIN" || 
                             payload.role === "ADMIN" || 
                             payload.authorities?.includes("ROLE_ADMIN")
          console.log("HeaderWrapper - JWT에서 확인:", { isAdmin: isAdminUser })
          setIsAdmin(isAdminUser)
        } catch (err) {
          console.error("HeaderWrapper - JWT 파싱 실패:", err)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    }

    checkAdminStatus()

    // authStateChanged 이벤트 리스너
    window.addEventListener("authStateChanged", checkAdminStatus)
    return () => {
      window.removeEventListener("authStateChanged", checkAdminStatus)
    }
  }, [pathname])

  if (loading) {
    return null // 또는 로딩 스피너
  }

  // 관리자 페이지이고 관리자 권한이 있으면 관리자 헤더 표시
  if (pathname?.startsWith("/admin") && isAdmin) {
    console.log("HeaderWrapper - 관리자 헤더 렌더링")
    return <AdminHeader />
  }

  // 일반 사용자 헤더 표시
  console.log("HeaderWrapper - 일반 헤더 렌더링")
  return <MarketplaceHeader />
}
