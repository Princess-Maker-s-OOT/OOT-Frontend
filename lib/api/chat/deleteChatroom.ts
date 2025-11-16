import type { ApiResponse } from "@/types/chat"

export async function deleteChatroom(chatroomId: string, token: string): Promise<ApiResponse<null>> {
  const res = await fetch(`http://localhost/api/v1/chatrooms/${chatroomId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return await res.json()
}