"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getClothesById, deleteClothes } from "@/lib/api/clothes"
import type { GetClothesByIdSuccessResponse } from "@/types/clothes"

export default function ClothesDetailPage() {
  const { clothesId } = useParams()
  const router = useRouter()
  const [data, setData] = useState<GetClothesByIdSuccessResponse["data"] | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!clothesId) {
      setError("ID가 없습니다.")
      setLoading(false)
      return
    }

    getClothesById(Number(clothesId))
      .then((res) => {
        if (res.success) {
          setData(res.data)
        } else {
          setError(res.message)
        }
      })
      .catch(() => {
        setError("서버 오류")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [clothesId])

  const handleDelete = async () => {
    const confirmed = confirm("정말 삭제하시겠습니까?")
    if (!confirmed || !clothesId) return

    setDeleting(true)
    const result = await deleteClothes(Number(clothesId))
    setDeleting(false)

    if (result.success) {
      alert("삭제되었습니다.")
      router.push("/clothes")
    } else {
      alert(`삭제 실패: ${result.message}`)
    }
  }

  if (loading) return <div className="p-6">불러오는 중...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!data) return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">옷 상세 정보</h1>

      <div className="mb-4">
        <img
          src={data.clothesImages.find((img) => img.isMain)?.imageUrl ?? "/placeholder.jpg"}
          alt="대표 이미지"
          className="w-full h-64 object-cover rounded bg-gray-100"
        />
      </div>

      <div className="space-y-2 text-sm">
        <p><strong>설명:</strong> {data.description}</p>
        <p><strong>색상:</strong> {data.clothesColor}</p>
        <p><strong>사이즈:</strong> {data.clothesSize ?? "정보 없음"}</p>
        <p><strong>카테고리 ID:</strong> {data.categoryId}</p>
        <p><strong>등록자 ID:</strong> {data.userId}</p>
      </div>

      {data.clothesImages.length > 1 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold mb-2">추가 이미지</h2>
          <div className="grid grid-cols-2 gap-4">
            {data.clothesImages
              .filter((img) => !img.isMain)
              .map((img) => (
                <img
                  key={img.imageId}
                  src={img.imageUrl}
                  alt={`image-${img.imageId}`}
                  className="w-full h-40 object-cover rounded bg-gray-100"
                />
              ))}
          </div>
        </div>
      )}

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        {deleting ? "삭제 중..." : "삭제하기"}
      </button>
    </div>
  )
}