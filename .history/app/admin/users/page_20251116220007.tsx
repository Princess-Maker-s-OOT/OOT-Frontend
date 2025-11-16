"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter } from "lucide-react"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            회원 관리
          </h1>
          <p className="text-muted-foreground mt-1">전체 회원 조회 및 관리</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="아이디, 이름, 이메일로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Filter className="w-4 h-4 mr-2" />
              필터
            </Button>
            <Button variant="outline">검색</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>회원 데이터를 불러오는 중입니다...</p>
            <p className="text-sm mt-2">API 연동이 완료되면 회원 목록이 표시됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
