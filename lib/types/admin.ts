export interface UserStatistics {
  totalUsers: number
  activeUsers: number
  deletedUsers: number
  newUsers: {
    daily: number
    weekly: number
    monthly: number
  }
}

export interface GetUserStatisticsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_ADMIN_USER_STATISTICS_OK"
  message: string
  timestamp: string
  data: UserStatistics
}

export interface GetUserStatisticsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

export interface ClothesCategoryStat {
  name: string
  count: number
}

export interface ClothesColorStat {
  clothesColor: string
  count: number
}

export interface ClothesSizeStat {
  clothesSize: string
  count: number
}

export interface GetClothesStatisticsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_ADMIN_CLOTHES_STATISTICS_OK"
  message: string
  timestamp: string
  data: {
    totalClothes: number
    categoryStats: ClothesCategoryStat[]
    colorStats: ClothesColorStat[]
    sizeStats: ClothesSizeStat[]
  }
}

export interface GetClothesStatisticsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

export interface SalePostStatusCount {
  saleStatus: "SELLING" | "RESERVED" | "SOLD"
  count: number
}

export interface GetSalePostStatisticsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_ADMIN_SALE_POST_STATISTICS_OK"
  message: string
  timestamp: string
  data: {
    totalSales: number
    salePostStatusCounts: SalePostStatusCount[]
    newSalePost: {
      daily: number
      weekly: number
      monthly: number
    }
  }
}

export interface GetSalePostStatisticsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}

export interface CategoryStat {
  name: string
  count: number
}

export interface GetPopularCategoryStatisticsSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DASHBOARD_ADMIN_TOP10_CATEGORY_STATISTICS_OK"
  message: string
  timestamp: string
  data: {
    categoryStats: CategoryStat[]
  }
}

export interface GetPopularCategoryStatisticsErrorResponse {
  code: 401
  message: string
  status: "UNAUTHORIZED"
}