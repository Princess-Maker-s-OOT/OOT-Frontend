/**
 * API 설정
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1",
  ENDPOINTS: {
    // 유저 관련
    USER: {
      ME: "/user/me",
      VERIFY_PASSWORD: "/user/me/password-verification",
      PROFILE_IMAGE: "/user/me/profile-image",
    },
    // 옷 관련
    CLOTHES: {
      BASE: "/clothes",
      DETAIL: (id: number) => `/clothes/${id}`,
    },
    // 옷장 관련
    CLOSET: {
      BASE: "/closets",
      DETAIL: (id: number) => `/closets/${id}`,
      PUBLIC: "/closets/public",
      MY: "/closets/me",
    },
    // 추천 관련
    RECOMMENDATION: {
      BASE: "/recommendations",
      DETAIL: (id: number) => `/recommendations/${id}`,
    },
    // 판매 게시물 관련
    SALE_POSTS: {
      BASE: "/sale-posts",
      DETAIL: (id: number) => `/sale-posts/${id}`,
      MY: "/sale-posts/me",
      CREATE: "/sale-posts",
    },
    // 채팅 관련
    CHATS: {
      BASE: "/chats",
      DETAIL: (id: number) => `/chats/${id}`,
      MESSAGES: (chatId: number) => `/chats/${chatId}/messages`,
    },
    // 채팅방 관련
    CHATROOMS: {
      BASE: "/chatrooms",
      DETAIL: (id: number) => `/chatrooms/${id}`,
      MY: "/chatrooms/me",
    },
    // 카테고리 관련
    CATEGORIES: {
      BASE: "/categories",
      DETAIL: (id: number) => `/categories/${id}`,
    },
    // 기부 관련
    DONATIONS: {
      BASE: "/donations",
      DETAIL: (id: number) => `/donations/${id}`,
      MY: "/donations/me",
    },
    // 착용 기록 관련
    WEAR_RECORDS: {
      BASE: "/wear-records",
      DETAIL: (id: number) => `/wear-records/${id}`,
      MY: "/wear-records/me",
    },
    // 대시보드 관련
    DASHBOARDS: {
      BASE: "/dashboards",
      STATS: "/dashboards/stats",
      SUMMARY: "/dashboards/summary",
    },
  },
} as const

/**
 * 인증 관련 설정
 */
export const AUTH_CONFIG = {
  TOKEN_KEY: "accessToken",
  STORAGE_KEY: "ootAuth",
} as const

/**
 * 페이지네이션 기본 설정
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  DEFAULT_SORT: "createdAt",
  DEFAULT_DIRECTION: "DESC",
} as const

/**
 * 이미지 관련 설정
 */
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/gif"],
  DEFAULT_QUALITY: 0.8,
} as const

/**
 * 캐시 설정
 */
export const CACHE_CONFIG = {
  STALE_TIME: 60 * 1000, // 1분
  CACHE_TIME: 5 * 60 * 1000, // 5분
} as const