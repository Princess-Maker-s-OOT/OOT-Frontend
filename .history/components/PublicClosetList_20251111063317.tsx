"use client"

import { useEffect, useState } from "react"
import { getPublicClosets } from "@/lib/api/closet"
import type { ClosetItem } from "@/lib/types/closet"

export default function PublicClosetList() {
  const [closets, setClosets] = useState<ClosetItem[]>([])
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await getPublicClosets({ page: 0, size: 20 })
        if ("data" in res) {
          if (!mounted) return
          setClosets(res.data.content)
        } else {
          setError((res as any).message || "공개 클로젯을 불러오지 못했습니다.")
        }
      } catch (err) {
        setError("공개 클로젯 로드 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">공개 클로젯</h2>
      {error && <div className="text-sm text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {closets.map((c) => (
          <div key={c.closetId} className="border rounded p-3 bg-white">
            <h3 className="font-medium">{c.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )

}