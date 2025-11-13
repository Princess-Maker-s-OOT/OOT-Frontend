export interface Chatroom {
  otherUserNickname: string
  finalChat: string
  afterFinalChatTime: string
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