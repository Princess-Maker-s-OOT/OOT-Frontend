import type { ApiResponse } from "@/types/chat"

export async function createChatroom(salePostId: number, token: string): Promise<ApiResponse<null>> {
  const res = await fetch("http://localhost/api/v1/chatrooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ salePostId }),
  })

  return await res.json()
}