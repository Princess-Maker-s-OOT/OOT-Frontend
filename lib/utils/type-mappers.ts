/**
 * 타입 변환 유틸리티 - API 응답과 UI 타입 간 매핑을 안전하게 처리
 */

import type { Chatroom } from "@/types/chat"

/**
 * API Chatroom 응답을 UI 형태로 변환 (이제 실제 API 타입 사용)
 */
export function mapApiChatroomToUI(apiChatroom: any): Chatroom {
  return {
    chatroomId: apiChatroom?.chatroomId ?? 0,
    otherUserNickname: apiChatroom?.otherUserNickname ?? "알 수 없음",
    finalChat: apiChatroom?.finalChat ?? "",
    afterFinalChatTime: apiChatroom?.afterFinalChatTime ?? null,
  }
}

/**
 * API 채팅방 배열을 UI 형태로 변환
 */
export function mapApiChatroomsToUI(apiChatrooms: any[]): Chatroom[] {
  return apiChatrooms.map(mapApiChatroomToUI)
}

/**
 * API 응답 데이터가 성공했는지 안전하게 검증 (타입 좁히기)
 */
export function isApiResponseSuccess<T>(
  response: any
): response is { success: true; data?: T } {
  return response?.success === true
}

/**
 * API 응답 데이터가 실패했는지 안전하게 검증
 */
export function isApiResponseError(
  response: any
): response is { success: false; message?: string; code?: string } {
  return response?.success === false
}

/**
 * 에러 메시지를 안전하게 추출 (fallback 포함)
 */
export function getErrorMessage(response: any, fallback = "오류가 발생했습니다."): string {
  return response?.message ?? response?.error ?? fallback
}
