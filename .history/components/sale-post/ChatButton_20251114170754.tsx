/**
 * 판매글 상세 페이지에서 채팅하기 버튼
 * 채팅방 생성 후 해당 채팅방으로 이동
 */

"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createChatroom } from "@/lib/api/chatrooms"

interface ChatButtonProps {
  salePostId: number
}

export default function ChatButton({ salePostId }: ChatButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleChatClick() {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      alert("로그인이 필요합니다")
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      const result = await createChatroom({ salePostId })
      
      if (result.success && result.data) {
        // 채팅방 생성 성공 시 해당 채팅방으로 이동
        router.push(`/chat/${result.data.chatroomId}`)
      } else {
        alert(result.error || "채팅방 생성에 실패했습니다")
      }
    } catch (error) {
      console.error("채팅방 생성 오류:", error)
      alert("채팅방 생성 중 오류가 발생했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleChatClick}
      disabled={loading}
      className="px-6 py-2 bg-sky-300 text-white rounded hover:bg-sky-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {loading ? "처리 중..." : "채팅하기"}
    </button>
  )
}
