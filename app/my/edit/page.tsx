"use client"
import EditMyInfoForm from "@/components/EditMyInfoForm"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getMyInfo } from "@/lib/api/user"
import type { UserProfile } from "@/lib/types/user"

export default function EditMyInfoPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    getMyInfo().then((res) => {
      if (res.success && res.data) {
        setProfile(res.data)
      } else {
        setError(res.message || "회원 정보를 불러올 수 없습니다.")
      }
      setLoading(false)
    })
  }, [])

  const handleSuccess = () => {
    // 마이페이지로 리다이렉트
    router.push("/my")
    // 페이지 새로고침으로 최신 정보 반영
    router.refresh()
  }

  return (
    <>
      {loading && <div className="p-6">회원 정보 불러오는 중...</div>}
      {!loading && error && <div className="p-6 text-red-500">{error}</div>}
      {!loading && !error && profile && (
        <EditMyInfoForm profile={profile} onSuccess={handleSuccess} />
      )}
    </>
  )
}