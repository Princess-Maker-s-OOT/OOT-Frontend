"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LinkClothesToClosetSchema } from "@/lib/validation"
import { linkClothesToCloset } from "@/lib/api/closet"
import { getClothes } from "@/lib/api/clothes"
import type { LinkClothesToClosetRequest } from "@/lib/validation"

interface Props {
  closetId: number
}

export default function LinkClothesForm({ closetId }: Props) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [clothesList, setClothesList] = useState<any[]>([])
  const [clothesLoading, setClothesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchClothes() {
      setClothesLoading(true)
      try {
        const result = await getClothes({ page: 0, size: 50 })
        if (result.success && result.data) {
          setClothesList(result.data.content)
        }
      } catch (err) {
        // 에러 무시 (폼에서 안내)
      } finally {
        setClothesLoading(false)
      }
    }
    fetchClothes()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (selectedIds.length === 0) {
      setError("등록할 옷을 선택하세요.")
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      // 여러 옷 등록 지원 (순차 등록)
      for (const clothesId of selectedIds) {
        const parsed = LinkClothesToClosetSchema.safeParse({ clothesId })
        if (!parsed.success) continue
        await linkClothesToCloset(closetId, parsed.data)
      }
      setSuccess("옷이 옷장에 등록되었습니다.")
      router.push(`/closets/${closetId}`)
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>테스트</div>
  )
}