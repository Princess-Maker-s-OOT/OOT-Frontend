"use client"

import { useEffect, useState } from "react"
import { getClosetClothes, removeClothesFromCloset } from "@/lib/api/closet"
import { createWearRecord } from "@/lib/api/wear-record"
import type { ClosetClothesItem } from "@/lib/types/closet"
import { useToast } from "@/hooks/use-toast"

interface Props {
  closetId: number
  isMine?: boolean
}

export default function ClosetClothesList({ closetId }: Props) {
  const [items, setItems] = useState<ClosetClothesItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [wearingId, setWearingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    getClosetClothes(closetId, {}).then((res) => {
      if ("data" in res && res.data) {
        setItems(res.data.content)
      } else {
        setError((res as any)?.message ?? "오류가 발생했습니다.")
      }
    })
  }, [closetId])

  async function handleRemove(clothesId: number) {
    const confirmed = window.confirm("이 옷을 옷장에서 제거하시겠습니까?")
    if (!confirmed) return

    setLoadingId(clothesId)
    try {
      const result = await removeClothesFromCloset(closetId, clothesId)
      if ((result as any)?.success) {
        setItems((prev) => prev.filter((item) => item.clothesId !== clothesId))
      } else {
        setError((result as any)?.message ?? "제거 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoadingId(null)
    }
  }

  async function handleWearToday(clothesId: number) {
    setWearingId(clothesId)
    
    try {
      const result = await createWearRecord({ clothesId })
      
      if (result.success) {
        toast({
          title: "착용 기록 완료",
          description: "오늘 착용한 옷으로 기록되었습니다.",
        })
      } else {
        toast({
          title: "착용 기록 실패",
          description: result.error || "착용 기록에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "오류 발생",
        description: err?.message || "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setWearingId(null)
    }
  }

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!items.length) return <div className="p-6 text-sm text-gray-500">등록된 옷이 없습니다.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-sky-700 mb-4">등록된 옷 목록</h1>
      {items.map((item) => (
        <div key={item.linkId} className="border rounded p-4 bg-white shadow-sm space-y-1">
          <div className="text-sm font-semibold">옷 ID: {item.clothesId}</div>
          <div className="text-sm">카테고리 ID: {item.categoryId}</div>
          <div className="text-sm">사이즈: {item.clothesSize}</div>
          <div className="text-sm">색상: {item.clothesColor}</div>
          <div className="text-sm text-gray-600">설명: {item.description}</div>
          {isMine && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleWearToday(item.clothesId)}
                disabled={wearingId === item.clothesId}
                className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 disabled:opacity-50 text-sm"
              >
                {wearingId === item.clothesId ? "기록 중..." : "오늘착용"}
              </button>
              <button
                onClick={() => handleRemove(item.clothesId)}
                disabled={loadingId === item.clothesId}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50 text-sm"
              >
                {loadingId === item.clothesId ? "제거 중..." : "옷 제거"}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}