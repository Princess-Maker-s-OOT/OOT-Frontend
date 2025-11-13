import type { ApiResponse, Chatroom } from "@/types/chat"

export async function fetchChatrooms(token: string): Promise<ApiResponse<{
  content: Chatroom[]
  size: number
  number: number
  hasNext: boolean
  hasPrevious: boolean
}>> {
  const res = await fetch("http://localhost:8080/api/v1/chatrooms", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return await res.json()
}