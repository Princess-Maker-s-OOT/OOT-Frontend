"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchChatrooms } from "@/lib/api/chat"
import type { Chatroom } from "@/types/chat"

export default function ChatRoomList() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Chatroom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

    fetchChatrooms(token).then((res) => {
      if (res.success && res.data) {
        setRooms(res.data.content)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-6">채팅방 불러오는 중...</div>

  return (
    <div className="space-y-4">
      {rooms.length === 0 ? (
        <div className="text-center text-gray-500 py-8">아직 채팅방이 없습니다</div>
      ) : (
        rooms.map((room) => (
          <div
            key={room.chatroomId}
            className="p-4 border rounded shadow-sm cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`/chat/${room.chatroomId}`)}
          >
            <div className="font-semibold">{room.otherUserNickname}</div>
            <div className="text-sm text-gray-600">{room.finalChat}</div>
            <div className="text-xs text-gray-400">{room.afterFinalChatTime}</div>
          </div>
        ))
      )}
    </div>
  )
}