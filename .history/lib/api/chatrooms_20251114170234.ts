/**
 * 채팅방 관련 API 클라이언트
 */

import { apiGet, apiPost, apiDelete } from "./client"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

// ==================== 요청 타입 ====================

export interface ChatroomRequest {
  salePostId: number
}

// ==================== 응답 타입 ====================

export interface ChatroomResponse {
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
export async function createChatroom(
  request: ChatroomRequest
): Promise<ApiResponse<void>> {
  return apiPost(`${API_URL}/chatrooms`, request)
}

/**
 * 채팅방 목록 조회
 * GET /v1/chatrooms
 */
export async function getChatrooms(
  page: number = 0,
  size: number = 10
): Promise<ApiResponse<SliceResponse<ChatroomResponse>>> {
  return apiGet(`${API_URL}/chatrooms?page=${page}&size=${size}`)
}

/**
 * 채팅방 삭제
 * DELETE /v1/chatrooms/{chatroomId}
 */
export async function deleteChatroom(
  chatroomId: number
): Promise<ApiResponse<void>> {
  return apiDelete(`${API_URL}/chatrooms/${chatroomId}`)
}

/**
 * 채팅 메시지 조회
 * GET /v1/chatrooms/{chatroomId}/chats
 */
export async function getChats(
  chatroomId: number,
  page: number = 0,
  size: number = 50
): Promise<ApiResponse<SliceResponse<ChatResponse>>> {
  return apiGet(`${API_URL}/chatrooms/${chatroomId}/chats?page=${page}&size=${size}`)
}
