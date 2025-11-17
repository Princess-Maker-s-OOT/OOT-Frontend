/**
 * 채팅방 관련 API 클라이언트
 */

import { apiGet, apiPost, apiDelete } from "./client"
import type { ApiResult } from "./client"

const API_PREFIX = "/api/v1"

// ==================== 요청 타입 ====================

export interface ChatroomRequest {
  salePostId: number
}

// ==================== 응답 타입 ====================

export interface ChatroomResponse {
  chatroomId: number
  otherUserNickname: string
  finalChat: string | null
  afterFinalChatTime: string | null // Duration은 문자열로 처리
}

export interface ChatResponse {
  chatroomId: number
  userId: number | null
  userNickname: string | null
  chatId: number
  content: string
  createdAt: string
}

export interface SliceResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
  }
  last: boolean
  first: boolean
  empty: boolean
}

export interface ApiResponse<T> {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
  data: T
}

// ==================== API 함수 ====================

/**
 * 채팅방 생성
 * POST /v1/chatrooms
 */
  request: ChatroomRequest
): Promise<ApiResult<ChatroomResponse>> {
  return apiPost(`${API_PREFIX}/chatrooms`, request)
}

/**
 * 채팅방 목록 조회
 * GET /v1/chatrooms
 */
  page: number = 0,
  size: number = 10
): Promise<ApiResult<SliceResponse<ChatroomResponse>>> {
  return apiGet(`${API_PREFIX}/chatrooms?page=${page}&size=${size}`)
}

/**
 * 채팅방 삭제
 * DELETE /v1/chatrooms/{chatroomId}
 */
  chatroomId: number
): Promise<ApiResult<void>> {
  return apiDelete(`${API_PREFIX}/chatrooms/${chatroomId}`)
}

/**
 * 채팅 메시지 조회
 * GET /v1/chatrooms/{chatroomId}/chats
 */
  chatroomId: number,
  page: number = 0,
  size: number = 50
): Promise<ApiResult<SliceResponse<ChatResponse>>> {
  return apiGet(`${API_PREFIX}/chatrooms/${chatroomId}/chats?page=${page}&size=${size}`)
}
