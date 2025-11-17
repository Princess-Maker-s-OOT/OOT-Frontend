"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getChatrooms, deleteChatroom, type ChatroomResponse } from "@/lib/api/chatrooms"

export default function ChatPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<ChatroomResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadChatrooms()
  }, [])

  async function loadChatrooms() {
    try {
      setLoading(true)
      const result = await getChatrooms(0, 20)
      if (result.success && result.data) {
        setRooms(result.data.content)
      } else {
        setError(result.message || "채팅방 목록을 불러올 수 없습니다")
      }
    } catch (err) {
      setError("채팅방 목록을 불러오는 중 오류가 발생했습니다")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(chatroomId: number) {
    if (!confirm("정말로 이 채팅방을 삭제하시겠습니까?")) return

    try {
      const result = await deleteChatroom(chatroomId)
      if (result.success) {
        setRooms((prev) => prev.filter((room) => room.chatroomId !== chatroomId))
      } else {
        alert(result.message || "채팅방 삭제에 실패했습니다")
      }
    } catch (err) {
      console.error("삭제 실패:", err)
      alert("채팅방 삭제에 실패했습니다")
    }
  }

  const formatRelativeTime = (iso: string | null): string => {
    if (!iso) return ""
    
    const now = new Date()
    const past = new Date(iso)
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diff < 60) return "방금 전"
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`
    
    return past.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
  }

  if (loading) return <div className="p-6">채팅방 목록을 불러오는 중...</div>

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F8FF] py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={loadChatrooms}
            className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F0F8FF] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-sky-700">채팅방 목록</h1>
        {rooms.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            아직 채팅방이 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {rooms.map((room) => (
              <div
                key={room.chatroomId}
                className="relative p-4 bg-white border rounded shadow-sm hover:bg-sky-50 transition"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(room.chatroomId)
                  }}
                  className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>

                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/chat/${room.chatroomId}`)}
                >
                  <div className="font-semibold text-lg text-sky-700">
                    {room.otherUserNickname}
                  </div>
                  {room.finalChat && (
                    <div className="text-sm text-gray-600 mt-1 truncate">
                      {room.finalChat}
                    </div>
                  )}
                  {room.afterFinalChatTime && (
                    <div className="text-xs text-gray-400 mt-1">
                      {formatRelativeTime(room.afterFinalChatTime)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}