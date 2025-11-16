import EditMyInfoForm from "@/components/EditMyInfoForm"
import { useEffect, useState } from "react"
import { getMyInfo } from "@/lib/api/user"

export default function EditMyInfoPage() {
  const [profile, setProfile] = useState(null)
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

  if (loading) return <div className="p-6">회원 정보 불러오는 중...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!profile) return null

  return <EditMyInfoForm profile={profile} />
}