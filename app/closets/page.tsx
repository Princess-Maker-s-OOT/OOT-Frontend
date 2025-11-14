"use client"

import { PublicClosetList } from "@/components/PublicClosetList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ClosetsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">공개 옷장 목록</CardTitle>
          <CardDescription>
            다른 사용자들이 공개한 옷장을 둘러보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PublicClosetList />
        </CardContent>
      </Card>
    </div>
  )
}
