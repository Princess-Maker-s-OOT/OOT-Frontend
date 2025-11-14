"use client"

import { useEffect, useState } from "react"
import { getMySalePosts } from "@/lib/api/sale-posts"
import { SalePostSummaryResponse } from "@/lib/types/sale-post"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MySalePosts() {
  const [salePosts, setSalePosts] = useState<SalePostSummaryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSalePosts() {
      try {
        setLoading(true)
        const result = await getMySalePosts({
          page: 0,
          size: 50,
          sort: "createdAt",
          direction: "DESC",
        })

        if (result.success && result.data) {
          setSalePosts(result.data.content)
        } else {
          setError(result.message || "판매글 목록을 불러올 수 없습니다.")
        }
      } catch (err: any) {
        console.error("판매글 목록 로드 실패:", err)
        setError(err?.message || "네트워크 오류")
      } finally {
        setLoading(false)
      }
    }
    fetchSalePosts()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      SELLING: { label: "판매중", variant: "default" },
      RESERVED: { label: "예약중", variant: "secondary" },
      SOLD_OUT: { label: "판매완료", variant: "outline" },
    }
    const config = statusMap[status] || { label: status, variant: "outline" }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">내 판매글 관리</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            판매글 등록
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="aspect-square w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>다시 시도</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">내 판매글 관리</h2>
        <Link href="/sale-posts/new">
          <Button className="bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            판매글 등록
          </Button>
        </Link>
      </div>

      {salePosts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">등록된 판매글이 없습니다.</p>
          <Link href="/sale-posts/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              첫 판매글 작성하기
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salePosts.map((post) => (
            <Link key={post.salePostId} href={`/sale-posts/${post.salePostId}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-lg mb-3 bg-gray-100">
                  {post.imageUrls && post.imageUrls.length > 0 ? (
                    <Image
                      src={post.imageUrls[0]}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      이미지 없음
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-1 flex-1">{post.title}</h3>
                    {getStatusBadge(post.status)}
                  </div>
                  
                  <p className="text-lg font-bold text-sky-600">
                    {post.price.toLocaleString()}원
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{post.tradeAddress}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
