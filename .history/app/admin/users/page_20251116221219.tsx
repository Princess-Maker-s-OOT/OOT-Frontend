"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getAdminUsers, type AdminUserItem } from "@/lib/api/admin-users"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"LOGIN_ID" | "NICKNAME" | "USERNAME" | "EMAIL">("NICKNAME")
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL")
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const pageSize = 20
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [currentPage, roleFilter])

  async function loadUsers() {
    try {
      setLoading(true)
      const result = await getAdminUsers(
        currentPage,
        pageSize,
        undefined,
        undefined,
        roleFilter === "ALL" ? undefined : roleFilter
      )

      if (result.success && result.data) {
        setUsers(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
      } else {
        toast({
          title: "오류",
          description: "회원 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("회원 목록 로드 오류:", err)
      toast({
        title: "오류",
        description: "회원 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      loadUsers()
      return
    }

    try {
      setLoading(true)
      setCurrentPage(0)
      const result = await getAdminUsers(
        0,
        pageSize,
        searchType,
        searchQuery.trim(),
        roleFilter === "ALL" ? undefined : roleFilter
      )

      if (result.success && result.data) {
        setUsers(result.data.content)
        setTotalPages(result.data.totalPages)
        setTotalElements(result.data.totalElements)
      } else {
        toast({
          title: "검색 실패",
          description: "회원 검색에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("회원 검색 오류:", err)
      toast({
        title: "오류",
        description: "회원 검색 중 오류가 발생했습니다.",
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="w-8 h-8" />
            회원 관리
          </h1>
          <p className="text-muted-foreground mt-1">전체 회원 {totalElements.toLocaleString()}명</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>회원 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOGIN_ID">아이디</SelectItem>
                <SelectItem value="NICKNAME">닉네임</SelectItem>
                <SelectItem value="USERNAME">이름</SelectItem>
                <SelectItem value="EMAIL">이메일</SelectItem>
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
            <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="USER">일반</SelectItem>
                <SelectItem value="ADMIN">관리자</SelectItem>
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
          <CardTitle>회원 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">아이디</th>
                      <th className="pb-3 font-medium">닉네임</th>
                      <th className="pb-3 font-medium">이름</th>
                      <th className="pb-3 font-medium">이메일</th>
                      <th className="pb-3 font-medium">전화번호</th>
                      <th className="pb-3 font-medium">로그인 유형</th>
                      <th className="pb-3 font-medium">역할</th>
                      <th className="pb-3 font-medium">가입일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.userId} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 text-sm">{user.userId}</td>
                        <td className="py-3 text-sm font-medium">{user.loginId}</td>
                        <td className="py-3 text-sm">{user.nickname}</td>
                        <td className="py-3 text-sm">{user.username}</td>
                        <td className="py-3 text-sm">{user.email}</td>
                        <td className="py-3 text-sm">{user.phoneNumber || "-"}</td>
                        <td className="py-3 text-sm">
                          {user.loginType === "SOCIAL" ? (
                            <Badge variant="outline">{user.socialProvider}</Badge>
                          ) : (
                            <Badge variant="secondary">일반</Badge>
                          )}
                        </td>
                        <td className="py-3 text-sm">
                          {user.role === "ADMIN" ? (
                            <Badge className="bg-purple-600">관리자</Badge>
                          ) : (
                            <Badge variant="secondary">일반</Badge>
                          )}
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalElements)} / {totalElements.toLocaleString()}명
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
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>검색 결과가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
