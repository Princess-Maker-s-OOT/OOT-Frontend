export interface Chatroom {
  chatroomId: number
  otherUserNickname: string
  finalChat: string | null
  afterFinalChatTime: string | null
}

export interface ChatMessage {
  chatroomId: string
  userId: string
  userNickname: string
  chatId: string
  content: string
  createdAt: string
}

export interface ApiResponse<T> {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
  data?: T
}