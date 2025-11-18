"use client"

import { useEffect, useState } from "react"
import { getMyClosets, deleteCloset } from "@/lib/api/closet"
import { ClosetItem } from "@/lib/types/closet"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MyCloset() {
  const [closets, setClosets] = useState<ClosetItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClosets() {
      try {
        setLoading(true)
        const result = await getMyClosets({
          page: 0,
          size: 50,
        })

        if (result.success && result.data) {
          setClosets(result.data.content)
        } else {
          setError(result.message || "옷장 목록을 불러올 수 없습니다.")
        }
      } catch (err: any) {
        console.error("옷장 목록 로드 실패:", err)
        setError(err?.message || "네트워크 오류")
      } finally {
        setLoading(false)
      }
    }
    fetchClosets()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">내 옷장 관리</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            옷장 등록
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="aspect-video w-full mb-2" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
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
        <h2 className="text-xl font-semibold">내 옷장 관리</h2>
        <Link href="/closets/new">
          <Button className="bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            옷장 등록
          </Button>
        </Link>
      </div>

      {closets.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">등록된 옷장이 없습니다.</p>
          <Link href="/closets/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              첫 옷장 만들기
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {closets.map((closet) => (
            <Card key={closet.closetId} className="p-8 min-h-[340px] hover:shadow-lg transition-shadow cursor-pointer relative">
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <Link href={`/closets/${closet.closetId}/edit`}>
                  <Button size="sm" className="bg-sky-400 hover:bg-sky-500 text-white border-sky-400">수정</Button>
                </Link>
                <Button size="sm" variant="destructive" onClick={async () => {
                  if (!confirm('정말로 이 옷장을 삭제하시겠습니까?')) return;
                  try {
                    const result = await deleteCloset(closet.closetId);
                    if (result.success) {
                      alert('옷장이 삭제되었습니다.');
                      window.location.reload();
                    } else {
                      alert(result.message || '옷장 삭제에 실패했습니다.');
                    }
                  } catch (err) {
                    alert('옷장 삭제 중 오류가 발생했습니다.');
                  }
                }}>
                  삭제
                </Button>
              </div>
              <Link href={`/closets/${closet.closetId}`} className="block">
                <div className="aspect-video relative overflow-hidden rounded-lg mb-2 bg-gray-100">
                  {closet.imageUrl ? (
                    <Image
                      src={closet.imageUrl}
                      alt={closet.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      이미지 없음
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{closet.name}</h3>
                  <Badge variant={closet.isPublic ? "default" : "secondary"}>
                    {closet.isPublic ? "공개" : "비공개"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {closet.description || "설명 없음"}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}