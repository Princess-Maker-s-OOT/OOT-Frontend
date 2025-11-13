export type MockChatMessage = {
  chatId: number
  chatroomId: number
  userId: number
  userNickname: string
  content: string
  createdAt: string
}

export const MOCK_CHAT_MESSAGES: MockChatMessage[] = [
  {
    chatId: 1,
    chatroomId: 1,
    userId: 201,
    userNickname: "보검",
    content: "빈티지 자켓 관심 있어요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    chatId: 2,
    chatroomId: 1,
    userId: 101,
    userNickname: "나",
    content: "감사합니다! 상태 A급이에요.",
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    chatId: 5,
    chatroomId: 1,
    userId: 201,
    userNickname: "보검",
    content: "혹시 실측 사이즈 알 수 있을까요?",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    chatId: 6,
    chatroomId: 1,
    userId: 101,
    userNickname: "나",
    content: "어깨 48, 가슴 55, 총장 72cm입니다!",
    createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    chatId: 7,
    chatroomId: 1,
    userId: 201,
    userNickname: "보검",
    content: "감사합니다! 고민 좀 해볼게요 :)",
    createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    chatId: 11,
    chatroomId: 1,
    userId: 101,
    userNickname: "나",
    content: "네! 편하게 연락주세요~",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    chatId: 3,
    chatroomId: 2,
    userId: 202,
    userNickname: "소영",
    content: "가죽 부츠 사이즈 어떻게 되나요?",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    chatId: 4,
    chatroomId: 2,
    userId: 102,
    userNickname: "나",
    content: "240~250 사이즈입니다!",
    createdAt: new Date(Date.now() - 1000 * 60 * 11).toISOString(),
  },
  {
    chatId: 8,
    chatroomId: 2,
    userId: 202,
    userNickname: "소영",
    content: "굽 높이는 얼마나 되나요?",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    chatId: 9,
    chatroomId: 2,
    userId: 102,
    userNickname: "나",
    content: "굽은 약 4cm 정도예요. 착화감도 좋아요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 9).toISOString(),
  },
  {
    chatId: 10,
    chatroomId: 2,
    userId: 202,
    userNickname: "소영",
    content: "좋네요! 고민 좀 해볼게요~",
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    chatId: 12,
    chatroomId: 3,
    userId: 301,
    userNickname: "송강",
    content: "이 니트 아직 구매 가능할까요?",
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 최근 메시지
  },
  {
    chatId: 13,
    chatroomId: 3,
    userId: 103,
    userNickname: "나",
    content: "네! 재고 있어요 :)",
    createdAt: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
  },
]

export function getMockChatsByRoomId(chatroomId: number): MockChatMessage[] {
  return MOCK_CHAT_MESSAGES.filter((m) => m.chatroomId === chatroomId)
}