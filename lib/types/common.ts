// API 응답의 기본 구조
export interface ApiResponse {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
}

// 성공 응답의 기본 구조
export interface ApiSuccessResponse<T = any> extends ApiResponse {
  success: true
  data: T
}

// 에러 응답의 기본 구조
export interface ApiErrorResponse extends ApiResponse {
  success: false
  data?: string | null
}

// 페이지네이션 쿼리 파라미터
export interface PaginationQuery {
  page?: number
  size?: number
  sort?: string
  direction?: "ASC" | "DESC"
}

// 페이지네이션 응답 데이터
export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// HTTP 상태 코드와 메시지
export const HTTP_STATUS = {
  OK: "OK",
  CREATED: "CREATED",
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const

// HTTP 상태 값
export const HTTP_STATUS_VALUE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const

// HTTP 메서드
export const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const