/**
 * WebSocket STOMP 클라이언트 훅
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const WS_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export interface ChatMessage {
  chatroomId: number
  userId: number | null
  userNickname: string | null
  chatId: number
  content: string
  createdAt: string
}

export function useWebSocket(chatroomId: number | null) {
  const clientRef = useRef<Client | null>(null)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // 메시지 전송
  const sendMessage = useCallback((content: string) => {
    if (!clientRef.current || !connected || !chatroomId) {
      console.error("WebSocket not connected or chatroom not set")
      return
    }

    try {
      clientRef.current.publish({
        destination: `/app/chat/message/${chatroomId}`,
        body: JSON.stringify({ content }),
      })
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }, [connected, chatroomId])

  // WebSocket 연결
  useEffect(() => {
    if (!chatroomId) return

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      console.error("No access token found")
      return
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(`${WS_URL}/ws/chatroom`),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => {
        console.log("[STOMP Debug]", str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      console.log("[WebSocket] Connected")
      setConnected(true)

      // 채팅방 구독
      client.subscribe(`/topic/chat/${chatroomId}`, (message) => {
        try {
          const chatMessage: ChatMessage = JSON.parse(message.body)
          console.log("[WebSocket] Received message:", chatMessage)
          setMessages((prev) => [...prev, chatMessage])
        } catch (error) {
          console.error("[WebSocket] Failed to parse message:", error)
        }
      })
    }

    client.onStompError = (frame) => {
      console.error("[WebSocket] Broker error:", frame.headers["message"])
      console.error("[WebSocket] Details:", frame.body)
      setConnected(false)
    }

    client.onWebSocketClose = () => {
      console.log("[WebSocket] Disconnected")
      setConnected(false)
    }

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  }, [chatroomId])

  return {
    connected,
    messages,
    sendMessage,
    setMessages, // 초기 메시지 로드 시 사용
  }
}
