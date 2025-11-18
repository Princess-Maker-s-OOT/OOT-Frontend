"use client"

import { useEffect, useState } from "react"
import { getClosetClothes, removeClothesFromCloset } from "@/lib/api/closet"
import { getClothesById } from "@/lib/api/clothes"
import { createWearRecord } from "@/lib/api/wear-record"
import type { ClosetClothesItem } from "@/lib/types/closet"
import { useToast } from "@/hooks/use-toast"

interface Props {
  closetId: number
  isMine?: boolean
}

export default function ClosetClothesList({ closetId, isMine = false }: Props) {
  const [items, setItems] = useState<ClosetClothesItem[]>([])
  const [clothesDetails, setClothesDetails] = useState<Record<number, any>>({})
  const [error, setError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [wearingId, setWearingId] = useState<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    getClosetClothes(closetId, {}).then(async (res) => {
      if ("data" in res && res.data) {
        setItems(res.data.content)
        // 각 옷의 상세 정보 병렬 fetch
        const details: Record<number, any> = {}
        await Promise.all(res.data.content.map(async (item) => {
          const detailRes = await getClothesById(item.clothesId)
          if (detailRes.success && detailRes.data) {
            details[item.clothesId] = detailRes.data
          }
        }))
        setClothesDetails(details)
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold text-sky-700 mb-4">등록된 옷 목록</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => {
          const detail = clothesDetails[item.clothesId]
          const imageUrl = detail?.clothesImages?.find((img: any) => img.isMain)?.imageUrl || detail?.clothesImages?.[0]?.imageUrl
          return (
            <div key={item.linkId} className="flex flex-col items-center justify-between border rounded-xl bg-white shadow-sm p-4 aspect-square min-h-[220px]">
              {/* 옷 이미지 */}
              {imageUrl ? (
                <img src={imageUrl} alt="옷 이미지" className="w-24 h-24 object-cover rounded-lg mb-2" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400 text-xs mb-2">이미지 없음</div>
              )}
              {/* 옷 정보 */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-base font-semibold mb-1 truncate max-w-[100px]">{detail?.description || item.description}</div>
                <div className="text-xs text-gray-600">{detail?.clothesColor || item.clothesColor} / {detail?.clothesSize || item.clothesSize}</div>
              </div>
              {/* 버튼 영역 */}
              {isMine && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleWearToday(item.clothesId)}
                    disabled={wearingId === item.clothesId}
                    className="bg-sky-500 text-white px-2 py-1 rounded-lg hover:bg-sky-600 disabled:opacity-50 text-xs shadow"
                  >
                    {wearingId === item.clothesId ? "기록 중..." : "오늘착용"}
                  </button>
                  <button
                    onClick={() => handleRemove(item.clothesId)}
                    disabled={loadingId === item.clothesId}
                    className="bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-500 disabled:opacity-50 text-xs shadow"
                    title="옷 제거"
                  >
                    <span className="sr-only">옷 제거</span>
                    &#10005;
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}