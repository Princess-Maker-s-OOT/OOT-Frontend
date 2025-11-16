"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Filter, TrendingUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminSalePostsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const statusOptions = [
    { label: "전체", value: "ALL", color: "bg-gray-500" },
    { label: "판매중", value: "AVAILABLE", color: "bg-green-500" },
    { label: "예약중", value: "RESERVED", color: "bg-orange-500" },
    { label: "판매완료", value: "SOLD_OUT", color: "bg-blue-500" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            판매글 관리
          </h1>
          <p className="text-muted-foreground mt-1">전체 판매글 조회 및 관리</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.map((status) => (
          <Card key={status.value}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{status.label}</p>
                  <p className="text-2xl font-bold mt-1">-</p>
                </div>
                <div className={`w-12 h-12 rounded-full ${status.color} opacity-20`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>판매글 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="제목, 판매자, 카테고리로 검색..."
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
          <CardTitle>판매글 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>판매글 데이터를 불러오는 중입니다...</p>
            <p className="text-sm mt-2">API 연동이 완료되면 판매글 목록이 표시됩니다.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
