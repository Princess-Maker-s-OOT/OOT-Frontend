"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Users, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { getAdminUserStatistics, getAdminClothesStatistics, getAdminSalePostStatistics, getAdminTopCategoryStatistics } from "@/lib/api/dashboard"
import type { AdminUserStatisticsResponse, AdminClothesStatisticsResponse, AdminSalePostStatisticsResponse, AdminTopCategoryStatisticsResponse } from "@/lib/types/dashboard"

export default function AdminDashboard() {
  const [baseDate, setBaseDate] = useState<string>("")
  const [loading, setLoading] = useState(false)
  
  const [userStats, setUserStats] = useState<AdminUserStatisticsResponse | null>(null)
  const [clothesStats, setClothesStats] = useState<AdminClothesStatisticsResponse | null>(null)
  const [salePostStats, setSalePostStats] = useState<AdminSalePostStatisticsResponse | null>(null)
  const [categoryStats, setCategoryStats] = useState<AdminTopCategoryStatisticsResponse | null>(null)
  
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = async (date?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const [userResult, clothesResult, salePostResult, categoryResult] = await Promise.all([
        getAdminUserStatistics(date),
        getAdminClothesStatistics(),
        getAdminSalePostStatistics(date),
        getAdminTopCategoryStatistics()
      ])

      if (userResult.success) {
        setUserStats(userResult.data)
      } else {
        setError(prev => prev ? `${prev}, 사용자 통계: ${userResult.error}` : `사용자 통계: ${userResult.error}`)
      }

      if (clothesResult.success) {
        setClothesStats(clothesResult.data)
      } else {
        setError(prev => prev ? `${prev}, 옷 통계: ${clothesResult.error}` : `옷 통계: ${clothesResult.error}`)
      }

      if (salePostResult.success) {
        setSalePostStats(salePostResult.data)
      } else {
        setError(prev => prev ? `${prev}, 판매글 통계: ${salePostResult.error}` : `판매글 통계: ${salePostResult.error}`)
      }

      if (categoryResult.success) {
        setCategoryStats(categoryResult.data)
      } else {
        setError(prev => prev ? `${prev}, 카테고리 통계: ${categoryResult.error}` : `카테고리 통계: ${categoryResult.error}`)
      }
    } catch (err) {
      setError("통계 데이터를 불러오는 중 오류가 발생했습니다.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllData()
  }, [])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseDate(e.target.value)
  }

  const handleApplyDate = () => {
    fetchAllData(baseDate || undefined)
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">플랫폼 전체 통계 및 인사이트</p>
        </div>
        
        <div className="flex items-end gap-2">
          <div>
            <Label htmlFor="baseDate" className="text-sm">기준 날짜</Label>
            <Input
              id="baseDate"
              type="date"
              value={baseDate}
              onChange={handleDateChange}
              className="w-[180px]"
            />
          </div>
          <Button onClick={handleApplyDate} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            조회
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* 사용자 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            사용자 통계
          </CardTitle>
          <CardDescription>전체 사용자 현황 및 신규 가입 추이</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : userStats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">전체 사용자</p>
                <p className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">활성 사용자</p>
                <p className="text-2xl font-bold text-green-600">{userStats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">비활성 사용자</p>
                <p className="text-2xl font-bold text-gray-400">{userStats.inactiveUsers.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">일간 신규</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.dailyNewUsers.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">주간 신규</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.weeklyNewUsers.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">월간 신규</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.monthlyNewUsers.toLocaleString()}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">데이터를 불러올 수 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 옷 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            옷 통계
          </CardTitle>
          <CardDescription>전체 옷 현황 및 공개 설정</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : clothesStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">전체 옷</p>
                <p className="text-2xl font-bold">{clothesStats.totalClothes.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">공개 옷</p>
                <p className="text-2xl font-bold text-green-600">{clothesStats.publicClothes.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">비공개 옷</p>
                <p className="text-2xl font-bold text-gray-400">{clothesStats.privateClothes.toLocaleString()}</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">사용자당 평균</p>
                <p className="text-2xl font-bold text-blue-600">{clothesStats.averageClothesPerUser.toFixed(1)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">데이터를 불러올 수 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 판매글 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            판매글 통계
          </CardTitle>
          <CardDescription>전체 판매글 현황 및 상태별 분포</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : salePostStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">전체 판매글</p>
                  <p className="text-2xl font-bold">{salePostStats.totalSalePosts.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">판매 중</p>
                  <p className="text-2xl font-bold text-green-600">{salePostStats.activeSalePosts.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">판매 완료</p>
                  <p className="text-2xl font-bold text-blue-600">{salePostStats.soldSalePosts.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">예약 중</p>
                  <p className="text-2xl font-bold text-orange-600">{salePostStats.reservedSalePosts.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">일간 신규</p>
                  <p className="text-2xl font-bold text-purple-600">{salePostStats.dailyNewSalePosts.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">주간 신규</p>
                  <p className="text-2xl font-bold text-purple-600">{salePostStats.weeklyNewSalePosts.toLocaleString()}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">월간 신규</p>
                  <p className="text-2xl font-bold text-purple-600">{salePostStats.monthlyNewSalePosts.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">데이터를 불러올 수 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 인기 카테고리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            인기 카테고리 TOP 10
          </CardTitle>
          <CardDescription>가장 많이 등록된 카테고리</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : categoryStats && categoryStats.topCategories.length > 0 ? (
            <div className="space-y-2">
              {categoryStats.topCategories.map((category, index) => (
                <div key={category.categoryName} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{category.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{category.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">개</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">데이터를 불러올 수 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
