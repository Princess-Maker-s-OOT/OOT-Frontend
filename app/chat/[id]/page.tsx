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

  // chatroomId가 유효하지 않으면 0을 전달 (useWebSocket에서 처리)
  const validChatroomId = !isNaN(chatroomId) && chatroomId > 0 ? chatroomId : 0
  const { connected, messages, sendMessage, setMessages } = useWebSocket(validChatroomId)

  // 초기 메시지 로드
  useEffect(() => {
    if (!chatroomId || isNaN(chatroomId) || chatroomId <= 0) return

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="text-center">채팅 내역을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">채팅방 #{chatroomId}</h1>
          <div className={`px-3 py-1 rounded text-sm ${connected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {connected ? "연결됨" : "연결 끊김"}
          </div>
        </div>

        <div className="bg-[#E6F4FF] rounded-lg p-4 flex flex-col h-[calc(100vh-200px)]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500">채팅 메시지가 없습니다</div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.userId === myUserId
                return (
                  <div
                    key={msg.chatId}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded shadow ${
                        isMine
                          ? "bg-blue-500 text-white"
                          : "bg-white border border-gray-300"
                      }`}
                    >
                      {!isMine && msg.userNickname && (
                        <div className="text-sm font-semibold mb-1">
                          {msg.userNickname}
                        </div>
                      )}
                      <div className="text-base">{msg.content}</div>
                      <div className={`text-xs mt-1 ${isMine ? "text-blue-100" : "text-gray-400"}`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요"
              disabled={!connected}
              className="flex-1 bg-white border border-gray-300 rounded px-4 py-2 text-sm disabled:bg-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={!connected || !input.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}