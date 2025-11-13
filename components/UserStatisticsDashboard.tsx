"use client"

import { useEffect, useState } from "react"
import { getUserStatistics } from "@/lib/api/admin"
import type { UserStatistics } from "@/lib/types/admin"
import UserStatisticsCard from "./UserStatisticsCard"

export default function UserStatisticsDashboard() {
  const [stats, setStats] = useState<UserStatistics | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getUserStatistics(token).then((res) => {
      if ("data" in res) setStats(res.data)
      else setError(res.message)
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!stats) return <div className="p-6 text-sm text-gray-500">통계 데이터를 불러오는 중...</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">유저 통계 대시보드</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <UserStatisticsCard title="전체 유저 수" value={stats.totalUsers} />
        <UserStatisticsCard title="활성 유저 수" value={stats.activeUsers} color="green" />
        <UserStatisticsCard title="삭제 유저 수" value={stats.deletedUsers} color="red" />
        <UserStatisticsCard title="신규 가입자 (일간)" value={stats.newUsers.daily} color="purple" />
        <UserStatisticsCard title="신규 가입자 (주간)" value={stats.newUsers.weekly} color="purple" />
        <UserStatisticsCard title="신규 가입자 (월간)" value={stats.newUsers.monthly} color="purple" />
      </div>
    </div>
  )
}