"use client"

import { useEffect, useState } from "react"
import { getPublicClosets } from "@/lib/api/closet"
import type { ClosetItem } from "@/lib/types/closet"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PublicClosetList() {
  const [closets, setClosets] = useState<ClosetItem[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)
      setError(undefined)
      try {
        const res = await getPublicClosets({ page: 0, size: 20 })
        if (!mounted) return
        
        if (res.success && res.data) {
          setClosets(res.data.content)
        } else {
          setError(res.message || "공개 옷장을 불러오지 못했습니다.")
        }
      } catch (err) {
        if (!mounted) return
        console.error("옷장 로드 에러:", err)
        setError("공개 옷장 로드 중 오류가 발생했습니다.")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    )
  }

  if (closets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">공개된 옷장이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {closets.map((closet) => (
        <Link key={closet.closetId} href={`/closets/${closet.closetId}`}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg">{closet.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {closet.imageUrl ? (
                <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={closet.imageUrl}
                    alt={closet.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">이미지 없음</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {closet.description || "설명이 없습니다."}
              </p>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {new Date(closet.createdAt).toLocaleDateString()}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}