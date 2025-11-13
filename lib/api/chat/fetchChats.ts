import type { ApiResponse, ChatMessage } from "@/types/chat"

export async function fetchChats(chatroomId: string, token: string): Promise<ApiResponse<{
  content: ChatMessage[]
  size: number
  number: number
  hasNext: boolean
  hasPrevious: boolean
}>> {
  const res = await fetch(`http://localhost:8080/api/v1/chatrooms/${chatroomId}/chats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return await res.json()
}