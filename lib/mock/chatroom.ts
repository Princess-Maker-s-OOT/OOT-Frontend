import { MOCK_CHAT_MESSAGES } from "./chat"

export type MockChatroom = {
  chatroomId: number
  salePostId: number
  otherUserNickname: string
  finalChat: string
  afterFinalChatTime: string // ISO string
  unreadCount: number
}

export function getMockChatrooms(): MockChatroom[] {
  const chatroomIds = [...new Set(MOCK_CHAT_MESSAGES.map((m) => m.chatroomId))]

  return chatroomIds.map((roomId) => {
    const messages = MOCK_CHAT_MESSAGES.filter((m) => m.chatroomId === roomId)
    const finalMessage = messages[messages.length - 1]

    const otherUser = messages.find((m) => m.userNickname !== "나")?.userNickname ?? "알 수 없음"

    const unreadCount = messages.filter(
      (m) => m.userNickname !== "나" && new Date(m.createdAt) > new Date(Date.now() - 1000 * 60 * 7)
    ).length

    return {
      chatroomId: roomId,
      salePostId: roomId,
      otherUserNickname: otherUser,
      finalChat: finalMessage?.content ?? "",
      afterFinalChatTime: finalMessage?.createdAt ?? new Date().toISOString(),
      unreadCount,
    }
  })
}

export function getMockChatroomById(id: number): MockChatroom | null {
  return getMockChatrooms().find((r) => r.chatroomId === id) ?? null
}