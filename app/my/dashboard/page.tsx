"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface CategoryStat {
  categoryName: string
  count: number
}

interface DashboardUserSummaryResponse {
  totalCount: number
  categoryStats: CategoryStat[]
}

interface ClothesWearCount {
  clothesId: number
  clothesName: string
  count: number
}

interface NotWornOverPeriod {
  clothesId: number
  clothesName: string
  days: number
}

interface DashboardUserWearStatisticsResponse {
  wornThisWeek: ClothesWearCount[]
  topWornClothes: ClothesWearCount[]
  leastWornClothes: ClothesWearCount[]
  notWornOverPeriod: NotWornOverPeriod[]
}

export default function MyDashboardPage() {
  const [summary, setSummary] = useState<DashboardUserSummaryResponse | null>(null)
  const [statistics, setStatistics] = useState<DashboardUserWearStatisticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem("accessToken")
        if (!token) {
          setError("로그인이 필요합니다.")
          return
        }
        const summaryRes = await fetch("/api/v1/dashboards/users/overview", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const summaryJson = await summaryRes.json()
        if (!summaryJson.success || !summaryJson.data) throw new Error(summaryJson.message || "요약 정보 조회 실패")
        setSummary(summaryJson.data)

        const statisticsRes = await fetch("/api/v1/dashboards/users/statistics", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const statisticsJson = await statisticsRes.json()
        if (!statisticsJson.success || !statisticsJson.data) throw new Error(statisticsJson.message || "통계 정보 조회 실패")
        setStatistics(statisticsJson.data)
      } catch (err: any) {
        setError(err?.message || "대시보드 정보를 불러올 수 없습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-500">대시보드 정보를 불러오는 중...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">내 옷장 대시보드</h1>
      {summary && (
        <div className="mb-8 bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-2">옷 분포 현황</h2>
          <div className="mb-2">총 등록 옷 수: <span className="font-bold text-sky-600">{summary.totalCount}</span></div>
          <div>
            <h3 className="font-medium mb-1">카테고리별 분포</h3>
            <ul className="list-disc ml-6">
              {(summary.categoryStats || []).length > 0 ? (
                summary.categoryStats.map((cat) => (
                  <li key={cat.categoryName}>{cat.categoryName}: <span className="font-bold">{cat.count}</span></li>
                ))
              ) : (
                <li className="text-gray-500">카테고리 데이터가 없습니다.</li>
              )}
            </ul>
          </div>
        </div>
      )}
      {statistics && (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-2">착용 통계</h2>
          <div className="mb-4">
            <h3 className="font-medium mb-1">이번 주에 착용한 옷</h3>
            <ul className="list-disc ml-6">
              {(statistics.wornThisWeek || []).length > 0 ? (
                statistics.wornThisWeek.map((item) => (
                  <li key={item.clothesId}>{item.clothesName}: <span className="font-bold">{item.count}회</span></li>
                ))
              ) : (
                <li className="text-gray-500">이번 주 착용 기록이 없습니다.</li>
              )}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-1">가장 많이 착용한 옷</h3>
            <ul className="list-disc ml-6">
              {(statistics.topWornClothes || []).length > 0 ? (
                statistics.topWornClothes.map((item) => (
                  <li key={item.clothesId}>{item.clothesName}: <span className="font-bold">{item.count}회</span></li>
                ))
              ) : (
                <li className="text-gray-500">착용 기록이 없습니다.</li>
              )}
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="font-medium mb-1">가장 적게 착용한 옷</h3>
            <ul className="list-disc ml-6">
              {(statistics.leastWornClothes || []).length > 0 ? (
                statistics.leastWornClothes.map((item) => (
                  <li key={item.clothesId}>{item.clothesName}: <span className="font-bold">{item.count}회</span></li>
                ))
              ) : (
                <li className="text-gray-500">데이터가 없습니다.</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-1">오랫동안 착용하지 않은 옷</h3>
            <ul className="list-disc ml-6">
              {(statistics.notWornOverPeriod || []).length > 0 ? (
                statistics.notWornOverPeriod.map((item) => (
                  <li key={item.clothesId}>{item.clothesName}: <span className="font-bold">{item.days}일 미착용</span></li>
                ))
              ) : (
                <li className="text-gray-500">모든 옷을 골고루 입고 있습니다!</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
