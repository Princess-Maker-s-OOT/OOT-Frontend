"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MyCloset() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">내 옷장</h2>

      {/* 옷장 등록 버튼 */}
      <Link href="/my/closet/new">
        <Button variant="outline">옷장 등록</Button>
      </Link>

      {/* 옷장 리스트 등 추가 */}
      {/* <ClosetList closets={...} /> */}
    </div>
  )
}