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