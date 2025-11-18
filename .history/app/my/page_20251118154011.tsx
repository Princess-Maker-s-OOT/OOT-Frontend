"use client"
import { getMyInfo } from "@/lib/api/user"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserProfile } from "@/lib/types/user"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MyClothes from "@/components/my/my-clothes"
import MyCloset from "@/components/my/my-closet"
import MyProfile from "@/components/my/my-profile"
import MySalePosts from "@/components/my/my-sale-posts"
import MyDashboard from "@/components/my/my-dashboard"
import { Mail, MapPin, Phone, User, BarChart3, Settings } from "lucide-react"
import MyLocationCard from "@/components/MyLocationCard"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MyPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("accessToken")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        const result = await getMyInfo()
        
        if (result.success && result.data) {
          setProfile(result.data)
        } else {
          setError(result.message || "프로필을 불러올 수 없습니다.")
        }
      } catch (err: any) {
        console.error("프로필 로드 실패:", err)
        setError(err?.message || "네트워크 오류")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "프로필을 불러올 수 없습니다."}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* 헤더 배경 */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-sky-400 via-sky-300 to-cyan-300 opacity-10"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* 프로필 헤더 카드 */}
        <Card className="mb-12 overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          {/* 프로필 배경 */}
          <div className="h-32 bg-gradient-to-r from-sky-300 via-sky-200 to-cyan-200"></div>

          {/* 프로필 정보 */}
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* 아바타 */}
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg bg-gradient-to-br from-sky-100 to-cyan-100">
                  <img
                    src={profile.imageUrl ?? "https://ui-avatars.com/api/?name=" + encodeURIComponent(profile.nickname) + "&background=random&color=fff"}
                    alt={profile.nickname}
                    className="object-cover"
                  />
                </Avatar>
              </div>

              {/* 기본 정보 */}
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nickname}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-sky-500" />
                    <span>{profile.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-sky-500" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-sky-500" />
                      <span>{profile.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 거래 희망 지역(상단) - 주소만 표시 */}
            <div className="mt-6 pt-6 border-t border-sky-100">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2 text-gray-700 w-full max-w-[400px]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold text-sm text-gray-600">거래 희망 지역</span>
                  </div>
                  <p className="text-gray-900 mb-4">{profile.tradeAddress}</p>
                </div>
                {/* 퀵 액션 버튼 */}
                <div className="flex gap-2">
                  <Link href="/my/dashboard">
                    <Button variant="outline" size="sm" className="gap-2">
                      <BarChart3 className="h-4 w-4" />
                      대시보드
                    </Button>
                  </Link>
                  <Link href="/my/devices">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      디바이스
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 탭 컨텐츠 */}
        <Tabs defaultValue="profile" className="space-y-6">
          {/* 탭 리스트 - 고급스럽게 스타일링 */}
          <div className="border-b border-sky-100 bg-white/50 backdrop-blur-sm rounded-lg p-2">
            <TabsList className="bg-transparent border-none p-0 gap-2">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-700 font-semibold rounded-lg px-6 py-2 transition-all"
              >
                👤 프로필
              </TabsTrigger>
              <TabsTrigger 
                value="sale-posts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-700 font-semibold rounded-lg px-6 py-2 transition-all"
              >
                💰 내 판매글
              </TabsTrigger>
              <TabsTrigger 
                value="clothes"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-700 font-semibold rounded-lg px-6 py-2 transition-all"
              >
                👕 내 옷
              </TabsTrigger>
              <TabsTrigger
                value="closet"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-700 font-semibold rounded-lg px-6 py-2 transition-all"
              >
                🗄️ 내 옷장
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white text-gray-700 font-semibold rounded-lg px-6 py-2 transition-all"
              >
                📊 대시보드
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 탭 컨텐츠 - 각 섹션에 카드 스타일 적용 */}
          <div className="animate-in fade-in">
            <TabsContent value="profile" className="space-y-6">
              <MyProfile
                profile={profile}
                onUpdate={async () => {
                  const result = await getMyInfo()
                  if (result.success && result.data) {
                    setProfile(result.data)
                  }
                }}
              />
            </TabsContent>

            <TabsContent value="sale-posts" className="space-y-6">
              <MySalePosts />
            </TabsContent>

            <TabsContent value="clothes" className="space-y-6">
              <MyClothes />
            </TabsContent>

            <TabsContent value="closet" className="space-y-6">
              <MyCloset />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6">
              <MyDashboard />
            </TabsContent>
          </div>
        </Tabs>
      {/* 마이페이지 하단에 위치정보 카드+지도만 표시 */}
      <MyLocationCard address={profile.tradeAddress} lat={profile.tradeLatitude} lng={profile.tradeLongitude} />
    </div>
    </div>
  )
}