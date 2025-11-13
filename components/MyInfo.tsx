"use client"

import { useEffect, useState } from "react"
import { getMyInfo } from "@/lib/api/user"
import type { GetMyInfoSuccessResponse } from "@/lib/types/user"

export default function MyInfo() {
  const [info, setInfo] = useState<GetMyInfoSuccessResponse["data"] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getMyInfo(token).then((res) => {
      if ("data" in res && res.data) setInfo(res.data as any)
      else setError((res as any)?.message ?? "오류가 발생했습니다.")
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!info) return <div className="p-6 text-sm text-gray-500">회원정보 불러오는 중...</div>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-sky-700">내 정보</h1>
      <div className="space-y-2 text-sm">
        <div><strong>닉네임:</strong> {info.nickname}</div>
        <div><strong>이름:</strong> {info.username}</div>
        <div><strong>아이디:</strong> {info.loginId}</div>
        <div><strong>이메일:</strong> {info.email}</div>
        <div><strong>전화번호:</strong> {info.phoneNumber}</div>
        <div><strong>거래 위치:</strong> {info.tradeAddress}</div>
        <div><strong>로그인 방식:</strong> {info.loginType}</div>
        {info.socialProvider && <div><strong>소셜 제공자:</strong> {info.socialProvider}</div>}
        {info.imageUrl && <img src={info.imageUrl} alt="프로필" className="w-24 h-24 rounded-full mt-4" />}
      </div>
    </div>
  )
}