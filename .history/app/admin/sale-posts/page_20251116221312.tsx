"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAdminSalePosts, getAdminSalePostStatusCount, type AdminSalePostItem } from "@/lib/api/admin-sale-posts"
import type { SalePostStatus } from "@/lib/types/sale-post"
import { useToast } from "@/hooks/use-toast"

export default function AdminSalePostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"TITLE" | "SELLER_NICKNAME" | "CATEGORY_NAME">("TITLE")
  const [statusFilter, setStatusFilter] = useState<"ALL" | SalePostStatus>("ALL")
  const [salePosts, setSalePosts] = useState<AdminSalePostItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [statusCount, setStatusCount] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    soldOut: 0,
  })
  const pageSize = 20
  const { toast } = useToast()

  useEffect(() => {
    loadSalePosts()
    loadStatusCount()
  }, [currentPage, statusFilter])

  async function loadSalePosts() {
    try {
      setLoading(true)
      const result = await getAdminSalePosts(
        currentPage,
        pageSize,
        statusFilter === "ALL" ? undefined : statusFilter,
        undefined,
        undefined
      )

      if (result.success && result.data) {
        setSalePosts(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
      } else {
        toast({
          title: "오류",
          description: "판매글 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("판매글 목록 로드 오류:", err)
      toast({
        title: "오류",
        description: "판매글 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function loadStatusCount() {
    try {
      const result = await getAdminSalePostStatusCount()
      if (result.success && result.data) {
        setStatusCount(result.data)
      }
    } catch (err) {
      console.error("판매글 통계 로드 오류:", err)
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadSalePosts()
      return
    }

    try {
      setLoading(true)
      setCurrentPage(0)
      const result = await getAdminSalePosts(
        0,
        pageSize,
        statusFilter === "ALL" ? undefined : statusFilter,
        searchType,
        searchQuery.trim()
      )

      if (result.success && result.data) {
        setSalePosts(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
      } else {
        toast({
          title: "검색 실패",
          description: "판매글 검색에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("판매글 검색 오류:", err)
      toast({
        title: "오류",
        description: "판매글 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function getStatusBadge(status: SalePostStatus) {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-600">판매중</Badge>
      case "RESERVED":
        return <Badge className="bg-orange-600">예약중</Badge>
      case "COMPLETED":
        return <Badge className="bg-blue-600">판매완료</Badge>
      case "TRADING":
        return <Badge className="bg-purple-600">거래중</Badge>
      case "CANCELLED":
        return <Badge variant="secondary">취소됨</Badge>
      case "DELETED":
        return <Badge variant="destructive">삭제됨</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const statusOptions = [
    { label: "전체", value: "ALL", count: statusCount.total, color: "bg-gray-500" },
    { label: "판매중", value: "AVAILABLE", count: statusCount.available, color: "bg-green-500" },
    { label: "예약중", value: "RESERVED", count: statusCount.reserved, color: "bg-orange-500" },
    { label: "판매완료", value: "COMPLETED", count: statusCount.soldOut, color: "bg-blue-500" },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            판매글 관리
          </h1>
          <p className="text-muted-foreground mt-1">전체 판매글 {totalElements.toLocaleString()}개</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusOptions.map((status) => (
          <Card key={status.value} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter(status.value as any)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{status.label}</p>
                  <p className="text-2xl font-bold mt-1">{status.count.toLocaleString()}</p>
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
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TITLE">제목</SelectItem>
                <SelectItem value="SELLER_NICKNAME">판매자</SelectItem>
                <SelectItem value="CATEGORY_NAME">카테고리</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="검색어를 입력하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="AVAILABLE">판매중</SelectItem>
                <SelectItem value="RESERVED">예약중</SelectItem>
                <SelectItem value="COMPLETED">판매완료</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              검색
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>판매글 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : salePosts.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">제목</th>
                      <th className="pb-3 font-medium">가격</th>
                      <th className="pb-3 font-medium">판매자</th>
                      <th className="pb-3 font-medium">카테고리</th>
                      <th className="pb-3 font-medium">상태</th>
                      <th className="pb-3 font-medium">거래 위치</th>
                      <th className="pb-3 font-medium">등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salePosts.map((post) => (
                      <tr key={post.salePostId} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 text-sm">{post.salePostId}</td>
                        <td className="py-3 text-sm font-medium max-w-[200px] truncate">{post.title}</td>
                        <td className="py-3 text-sm font-semibold">{post.price.toLocaleString()}원</td>
                        <td className="py-3 text-sm">{post.sellerNickname}</td>
                        <td className="py-3 text-sm">
                          <Badge variant="outline">{post.categoryName}</Badge>
                        </td>
                        <td className="py-3 text-sm">{getStatusBadge(post.status)}</td>
                        <td className="py-3 text-sm text-muted-foreground max-w-[150px] truncate">
                          {post.tradeAddress}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {formatDate(post.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements.toLocaleString()}개
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="flex items-center px-3 text-sm">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1 || loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
