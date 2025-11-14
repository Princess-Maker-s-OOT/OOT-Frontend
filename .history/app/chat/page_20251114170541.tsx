"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getChatrooms, deleteChatroom, type ChatroomResponse } from "@/lib/api/chatrooms"

export default function ChatPage() {
  const router = useRouter()
  const [rooms, setRooms] = useState<MockChatroom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")

    if (!token) {
      const mockRooms = getMockChatrooms()
      setRooms(mockRooms)
      setLoading(false)
      return
    }

    fetchChatrooms(token)
      .then((res) => {
        if (isApiResponseSuccess(res) && res.data && (res.data as any).content) {
          // 타입 변환 함수로 안전하게 매핑
          const mapped = mapApiChatroomsToUI((res.data as any).content)
          setRooms(mapped)
        } else {
          setRooms(getMockChatrooms())
        }
      })
  }, [])

  const handleDelete = async (chatroomId: number) => {
    const token = localStorage.getItem("accessToken")
    if (!token) return

  try {
  await deleteChatroom(String(chatroomId), token)
      setRooms((prev) => prev.filter((room) => room.chatroomId !== chatroomId))
    } catch (err) {
      console.error("삭제 실패:", err)
      alert("채팅방 삭제에 실패했습니다.")
    }
  }

  const formatRelativeTime = (iso: string): string => {
    const now = new Date()
    const past = new Date(iso)
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diff < 60) return `${diff}초 전`
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
    return `${Math.floor(diff / 86400)}일 전`
  }

  if (loading) return <div className="p-6">채팅방 불러오는 중...</div>

  return (
    <div className="min-h-screen bg-[#F0F8FF] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-sky-700">채팅방 목록</h1>
        <div className="space-y-4">
          {rooms.map((room) => (
            <div
              key={room.chatroomId}
              className="relative p-4 bg-white border rounded shadow-sm flex flex-col hover:bg-sky-50 transition"
            >
              {/* ✅ 삭제 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  const confirmed = window.confirm("정말로 이 채팅방을 삭제하시겠습니까?")
                  if (confirmed) {
                    handleDelete(room.chatroomId)
                  }
                }}
                className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
              >
                삭제
              </button>

              {/* ✅ 채팅방 정보 */}
              <div
                className="cursor-pointer flex flex-col"
                onClick={() => router.push(`/chat/${room.chatroomId}`)}
              >
                <div className="font-semibold text-lg text-sky-700">
                  {room.otherUserNickname}
                </div>
                <div className="text-sm text-gray-600 mt-1 truncate">{room.finalChat}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatRelativeTime(room.afterFinalChatTime)}
                </div>

                {/* ✅ 오른쪽 하단에 안읽음 표시 */}
                {room.unreadCount > 0 && (
                  <div className="mt-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full self-end">
                    {room.unreadCount}개 안읽음
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}