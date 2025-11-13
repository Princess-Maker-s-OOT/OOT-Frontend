import type { ChatMessage } from "@/types/chat"

export default function ChatMessageItem({ message }: { message: ChatMessage }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-semibold">{message.userNickname}</div>
      <div className="text-base">{message.content}</div>
      <div className="text-xs text-gray-400">{message.createdAt}</div>
    </div>
  )
}