"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { getChats, type ChatResponse } from "@/lib/api/chatrooms"
import { useWebSocket } from "@/hooks/useWebSocket"

export default function ChatDetailPage() {
  const { id } = useParams()
  const roomId = Number(id)
  const [messages, setMessages] = useState<MockChatMessage[]>([])
  const [status, setStatus] = useState("목데이터 연결됨")
  const [color, setColor] = useState("gray")
  const [input, setInput] = useState("")
  const [myUserId, setMyUserId] = useState<number | null>(null)
  const stompClientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!roomId) {
      setStatus("채팅방 ID 없음")
      setColor("red")
      return
    }

    const mockMessages = getMockChatsByRoomId(roomId)
    setMessages(mockMessages)

    // ✅ "나"의 userId를 메시지에서 추출
    const myMessage = mockMessages.find((m) => m.userNickname === "나")
    if (myMessage) {
      setMyUserId(myMessage.userId)
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setStatus("로그인이 필요합니다")
      setColor("red")
      return
    }

    const socket = new SockJS("http://localhost:8080/api/ws/chatroom")
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        setStatus("WebSocket 연결 완료")
        setColor("green")

        stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
          const body = JSON.parse(message.body)
          setMessages((prev) => [...prev, body])
        })
      },
      onStompError: (frame) => {
        setStatus("STOMP 오류 발생")
        setColor("red")
        console.error("STOMP 오류:", frame)
      },
    })

    stompClient.activate()
    stompClientRef.current = stompClient

    return () => {
      stompClient.deactivate()
    }
  }, [roomId])

  const handleSend = () => {
    if (!input.trim() || myUserId === null) return

    const token = localStorage.getItem("accessToken")
    const client = stompClientRef.current
    if (!token || !client || !client.connected) {
      alert("WebSocket 연결이 필요합니다.")
      return
    }

    const message: MockChatMessage = {
      chatId: Date.now(),
      chatroomId: roomId,
      userId: myUserId,
      userNickname: "나",
      content: input,
      createdAt: new Date().toISOString(),
    }

    client.publish({
      destination: `/app/chat/${roomId}`,
      body: JSON.stringify(message),
    })

    setInput("")
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