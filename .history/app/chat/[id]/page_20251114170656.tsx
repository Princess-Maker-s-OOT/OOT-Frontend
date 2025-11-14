"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { getChats, type ChatResponse } from "@/lib/api/chatrooms"
import { useWebSocket } from "@/hooks/useWebSocket"

export default function ChatDetailPage() {
  const { id } = useParams()
  const chatroomId = Number(id)
  
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [myUserId, setMyUserId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { connected, messages, sendMessage, setMessages } = useWebSocket(chatroomId)

  // 초기 메시지 로드
  useEffect(() => {
    if (!chatroomId) return

    loadChatHistory()
  }, [chatroomId])

  // 새 메시지가 추가되면 스크롤 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function loadChatHistory() {
    try {
      setLoading(true)
      const result = await getChats(chatroomId, 0, 50)
      if (result.success && result.data) {
        setMessages(result.data.content)
        
        // 내 userId 추출
        const myMessage = result.data.content.find((m) => m.userId !== null)
        if (myMessage) {
          setMyUserId(myMessage.userId)
        }
      }
    } catch (err) {
      console.error("채팅 내역 로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  function handleSend() {
    if (!input.trim()) return
    
    sendMessage(input)
    setInput("")
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-xl font-bold mb-4">채팅방 #{roomId}</h1>

      <div className="mb-4 p-3 border rounded font-semibold" style={{ color }}>
        현재 상태: {status}
      </div>

      {/* ✅ 채팅 박스 전체 */}
      <div className="bg-[#E6F4FF] rounded-lg p-4 flex flex-col justify-between h-[calc(100vh-200px)] overflow-y-auto">
        {/* ✅ 채팅 메시지 영역 */}
        <div className="flex flex-col gap-4 mb-4">
          {messages.length === 0 ? (
            <div className="text-gray-500">채팅 메시지가 없습니다.</div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.userId === myUserId
              return (
                <div
                  key={msg.chatId ?? `${msg.userId}-${msg.createdAt}`}
                  className={`max-w-[70%] p-3 rounded shadow bg-white ${
                    isMine
                      ? "border border-blue-300 self-end text-right"
                      : "border border-gray-300 self-start text-left"
                  }`}
                >
                  <div className="text-sm font-semibold">{msg.userNickname}</div>
                  <div className="text-base">{msg.content}</div>
                  <div className="text-xs text-gray-400">{formatTime(msg.createdAt)}</div>
                </div>
              )
            })
          )}
        </div>

        {/* ✅ 입력창 */}
        <div className="flex gap-2 mt-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  )
}