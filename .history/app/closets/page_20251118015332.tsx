"use client"

import { PublicClosetList } from "@/components/PublicClosetList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export default function ClosetsPage() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold">공개 옷장 목록</CardTitle>
              <CardDescription>
                다른 사용자들이 공개한 옷장을 둘러보세요
              </CardDescription>
            </div>
            {isAuthenticated && (
              <a
                href="/closets/new"
                className="bg-sky-100 text-sky-700 text-sm px-4 py-2 rounded hover:bg-sky-200 transition"
              >
                옷장 등록
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <PublicClosetList />
        </CardContent>
      </Card>
    </div>
  )
}
