export interface ClothesCategoryStat {
  name: string
  count: number
}

export interface GetUserClothesOverviewSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_USER_SUMMARY_OK"
  message: string
  timestamp: string
  data: {
    totalClothes: number
    categoryStat: ClothesCategoryStat[]
  }
}

export interface GetUserClothesOverviewErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

export interface WornClothesStat {
  clothesId: number
  clothesDescription: string
  wearCount: number
}

export interface NotWornClothesStat {
  clothesId: number
  clothesDescription: string
  lastWornAt: string
  daysNotWorn: number
}

export interface GetWearStatisticsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_USER_STATISTICS_OK"
  message: string
  timestamp: string
  data: {
    wornThisWeek: WornClothesStat[]
    topWornClothes: WornClothesStat[]
    leastWornClothes: WornClothesStat[]
    notWornOverPeriod: NotWornClothesStat[]
  }
}

export interface GetWearStatisticsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

// ==================== 관리자 대시보드 타입 ====================

// 카테고리 통계
export interface CategoryStat {
  categoryName: string
  count: number
}

// 옷 착용 횟수
export interface ClothesWearCount {
  clothesId: number
  clothesName: string
  wearCount: number
  lastWornDate?: string
  imageUrl?: string
}

// 장기 미착용 옷
export interface NotWornOverPeriod {
  clothesId: number
  clothesName: string
  daysSinceLastWorn: number
  lastWornDate?: string
  imageUrl?: string
}

// 사용자 대시보드 - 옷 분포 현황
export interface DashboardUserSummaryResponse {
  totalCount: number
  categoryStats: CategoryStat[]
}

// 사용자 대시보드 - 착용 통계
export interface DashboardUserWearStatisticsResponse {
  wornThisWeek: ClothesWearCount[]
  topWornClothes: ClothesWearCount[]
  leastWornClothes: ClothesWearCount[]
  notWornOverPeriod: NotWornOverPeriod[]
}

// 관리자 대시보드 - 사용자 통계
export interface AdminUserStatisticsResponse {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  dailyNewUsers: number
  weeklyNewUsers: number
  monthlyNewUsers: number
}

// 관리자 대시보드 - 옷 통계
export interface AdminClothesStatisticsResponse {
  totalClothes: number
  publicClothes: number
  privateClothes: number
  averageClothesPerUser: number
}

// 관리자 대시보드 - 판매글 통계
export interface AdminSalePostStatisticsResponse {
  totalSalePosts: number
  activeSalePosts: number
  soldSalePosts: number
  reservedSalePosts: number
  dailyNewSalePosts: number
  weeklyNewSalePosts: number
  monthlyNewSalePosts: number
}

// 관리자 대시보드 - 인기 카테고리
export interface AdminTopCategoryStatisticsResponse {
  topCategories: CategoryStat[]
}
