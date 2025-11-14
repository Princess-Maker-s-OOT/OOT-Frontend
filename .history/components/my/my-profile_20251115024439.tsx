"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ErrorView, LoadingView } from "@/components/ui/loading"
import { UserProfile } from "@/lib/types/user"
import { User, Mail, Phone, MapPin, Key, Edit } from "lucide-react"
import EditMyInfoForm from "@/components/EditMyInfoForm"

interface MyProfileProps {
  profile: UserProfile | null
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  onUpdate?: () => void
}

export default function MyProfile({ profile, isLoading, error, onRetry, onUpdate }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView message={error} retry={onRetry} />
  }

  if (!profile) {
    return null
  }

  if (isEditing) {
    return (
      <EditMyInfoForm
        profile={profile}
        onSuccess={() => {
          setIsEditing(false)
          onUpdate?.()
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  const loginTypeDisplay = profile.loginType === "LOGIN_ID" 
    ? "아이디/비밀번호" 
    : profile.socialProvider 
      ? `${profile.socialProvider} 소셜 로그인`
      : "소셜 로그인"

  const profileItems = [
    { icon: User, label: "이름", value: profile.username, color: "text-sky-500" },
    { icon: User, label: "닉네임", value: profile.nickname, color: "text-cyan-500" },
    { icon: Mail, label: "이메일", value: profile.email, color: "text-blue-500" },
    { icon: Phone, label: "전화번호", value: profile.phoneNumber || "미등록", color: "text-sky-600" },
    { 
      icon: MapPin, 
      label: "거래 희망 지역", 
      value: profile.tradeAddress, 
      color: "text-cyan-600" 
    },
    { 
      icon: Key, 
      label: "로그인 방식", 
      value: loginTypeDisplay,
      color: "text-blue-600"
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="h-24 bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200"></div>
        
        <div className="px-8 pb-8">
          <div className="flex justify-between items-center mb-8 -mt-4">
            <h2 className="text-2xl font-bold text-gray-900">프로필 정보</h2>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              정보 수정
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div 
                  key={index}
                  className="group p-4 rounded-lg border border-sky-100 hover:border-sky-300 hover:bg-sky-50/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className={`${item.color} p-2 rounded-lg bg-sky-50 group-hover:bg-sky-100 transition-all`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {item.label}
                      </dt>
                      <dd className="text-gray-900 font-medium truncate hover:text-clip">
                        {item.value}
                      </dd>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* 추가 정보 섹션 */}
      <Card className="overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className="px-8 py-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">위치 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">위도</p>
              <p className="text-2xl font-bold text-sky-600">{profile.tradeLatitude.toFixed(4)}°</p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">경도</p>
              <p className="text-2xl font-bold text-cyan-600">{profile.tradeLongitude.toFixed(4)}°</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}