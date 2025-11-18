"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

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

const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b']

  const [summary, setSummary] = useState<DashboardUserSummaryResponse | null>(null)
  const [statistics, setStatistics] = useState<DashboardUserWearStatisticsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [baseDate, setBaseDate] = useState<string>(new Date().toISOString().slice(0, 10))

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
        if (!summaryJson.success || !summaryJson.data) {
          throw new Error(summaryJson.message || "요약 정보 조회 실패")
        }
        setSummary(summaryJson.data)

        const statisticsRes = await fetch(`/api/v1/dashboards/users/statistics?baseDate=${baseDate}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const statisticsJson = await statisticsRes.json()
        if (!statisticsJson.success || !statisticsJson.data) {
          throw new Error(statisticsJson.message || "통계 정보 조회 실패")
        }
        setStatistics(statisticsJson.data)
      } catch (err: any) {
        setError(err?.message || "대시보드 정보를 불러올 수 없습니다.")
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [baseDate])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-40 w-full" />
        </Card>
        <Card className="p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-60 w-full" />
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
        >
          다시 시도
        </button>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* 날짜 선택 UI */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="baseDate" className="text-sm font-semibold text-gray-700">기준 날짜</label>
        <input
          id="baseDate"
          type="date"
          value={baseDate}
          onChange={e => setBaseDate(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>
      {/* 옷 분포 현황 */}
      {summary && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900">옷 분포 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">총 등록 옷 수</p>
                <p className="text-4xl font-bold text-sky-600">{summary.totalCount}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700">카테고리별 분포</h3>
                {(summary.categoryStats ?? []).map((cat) => (
                  <div key={cat.categoryName} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{cat.categoryName}</span>
                    <span className="font-semibold text-sky-600">{cat.count}개</span>
                  </div>
                ))}
              </div>
            </div>

            {(summary.categoryStats ?? []).length > 0 && (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summary.categoryStats ?? []}
                      dataKey="count"
                      nameKey="categoryName"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ categoryName, count }) => `${categoryName}: ${count}`}
                    >
                      {(summary.categoryStats ?? []).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* 착용 통계 */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 이번 주 착용 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">이번 주 착용한 옷</h3>
            {statistics.wornThisWeek.length > 0 ? (
              <div className="space-y-2">
                {statistics.wornThisWeek.map((item) => (
                  <div key={item.clothesId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700 truncate flex-1">{item.clothesName}</span>
                    <span className="font-semibold text-sky-600 ml-2">{item.count}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">이번 주 착용 기록이 없습니다.</p>
            )}
          </Card>

          {/* 가장 많이 착용 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">가장 많이 착용한 옷</h3>
            {statistics.topWornClothes.length > 0 ? (
              <div className="space-y-2">
                {statistics.topWornClothes.map((item, index) => (
                  <div key={item.clothesId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700 truncate">{item.clothesName}</span>
                    </div>
                    <span className="font-semibold text-sky-600">{item.count}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">착용 기록이 없습니다.</p>
            )}
          </Card>

          {/* 가장 적게 착용 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">가장 적게 착용한 옷</h3>
            {statistics.leastWornClothes.length > 0 ? (
              <div className="space-y-2">
                {statistics.leastWornClothes.map((item) => (
                  <div key={item.clothesId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700 truncate flex-1">{item.clothesName}</span>
                    <span className="font-semibold text-orange-600 ml-2">{item.count}회</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">데이터가 없습니다.</p>
            )}
          </Card>

          {/* 오래 미착용 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">오랫동안 입지 않은 옷</h3>
            {statistics.notWornOverPeriod.length > 0 ? (
              <div className="space-y-2">
                {statistics.notWornOverPeriod.map((item) => (
                  <div key={item.clothesId} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-700 truncate flex-1">{item.clothesName}</span>
                    <span className="font-semibold text-red-600 ml-2">{item.days}일</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">모든 옷을 골고루 입고 있습니다!</p>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
