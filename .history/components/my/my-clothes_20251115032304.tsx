"use client"

import { useEffect, useState } from "react"
import { getClothes } from "@/lib/api/clothes"
import { ClothesItem } from "@/lib/types/clothes"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function MyClothes() {
  const [clothes, setClothes] = useState<ClothesItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClothes() {
      try {
        setLoading(true)
        const result = await getClothes({
          page: 0,
          size: 50,
        })

        if (result.success && result.data) {
          setClothes(result.data.content)
        } else {
          setError(result.message || "옷 목록을 불러올 수 없습니다.")
        }
      } catch (err: any) {
        console.error("옷 목록 로드 실패:", err)
        setError(err?.message || "네트워크 오류")
      } finally {
        setLoading(false)
      }
    }
    fetchClothes()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">내 옷 관리</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            옷 등록
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
        <h2 className="text-xl font-semibold">내 옷 관리</h2>
        <Link href="/clothes/new">
          <Button className="bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            옷 등록
          </Button>
        </Link>
      </div>

      {clothes.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">등록된 옷이 없습니다.</p>
          <Link href="/clothes/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              첫 옷 등록하기
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clothes.map((item) => (
            <Link key={item.id} href={`/clothes/${item.id}`}>
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-square relative overflow-hidden rounded-lg mb-2 bg-gray-100">
                  {item.clothesImages && item.clothesImages.length > 0 ? (
                    <Image
                      src={item.clothesImages[0].imageUrl}
                      alt={item.description || "옷 이미지"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      이미지 없음
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {item.description || "설명 없음"}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded">
                    {item.clothesSize}
                  </span>
                  <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                    {item.clothesColor}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}