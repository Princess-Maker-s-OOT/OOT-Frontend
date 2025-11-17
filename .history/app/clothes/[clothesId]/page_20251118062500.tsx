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
  const [categoryName, setCategoryName] = useState<string>("")
  const [userNickname, setUserNickname] = useState<string>("")

  useEffect(() => {
    if (!clothesId) {
      setError("ID가 없습니다.")
      setLoading(false)
      return
    }

    getClothesById(Number(clothesId))
      .then(async (res) => {
        if (res.success) {
          setData(res.data)
          // 카테고리명 매핑
          const catRes = await import("@/lib/api/categories")
          const catApi = catRes.getCategories
          const catResult = await catApi(0, 200)
          if (catResult.success && catResult.data?.content) {
            const found = catResult.data.content.find((c) => c.id === res.data.categoryId)
            setCategoryName(found ? found.name : String(res.data.categoryId))
          } else {
            setCategoryName(String(res.data.categoryId))
          }
          // 등록자 닉네임 매핑
          const userRes = await import("@/lib/api/user")
          const getUserInfo = userRes.getMyInfo
          // NOTE: 실제로는 getUserById 필요, 임시로 본인 닉네임 사용
          const userResult = await getUserInfo()
          if (userResult.success && userResult.data) {
            setUserNickname(userResult.data.nickname)
          } else {
            setUserNickname(String(res.data.userId))
          }
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-10">
      <div className="max-w-3xl mx-auto p-8 rounded-xl shadow-lg bg-white/80 backdrop-blur-md">
        <h1 className="text-3xl font-bold mb-6 text-sky-700">옷 상세 정보</h1>
        <div className="mb-6 flex flex-col md:flex-row gap-8 items-start">
          <img
            src={data.clothesImages.find((img) => img.isMain)?.imageUrl ?? "/placeholder.jpg"}
            alt="대표 이미지"
            className="w-full md:w-64 h-64 object-cover rounded-xl bg-sky-100 shadow"
          />
          <div className="flex-1 space-y-3 text-base">
            <p><span className="font-semibold text-sky-600">설명:</span> {data.description}</p>
            <p><span className="font-semibold text-cyan-600">색상:</span> {data.clothesColor}</p>
            <p><span className="font-semibold text-blue-600">사이즈:</span> {data.clothesSize ?? "정보 없음"}</p>
            <p><span className="font-semibold text-sky-700">카테고리:</span> {categoryName}</p>
            <p><span className="font-semibold text-cyan-700">등록자:</span> {userNickname}</p>
          </div>
        </div>
        {data.clothesImages.length > 1 && (
          <div className="mt-6">
            <h2 className="text-base font-semibold mb-2 text-sky-700">추가 이미지</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.clothesImages.filter((img) => !img.isMain).map((img) => (
                <img key={img.imageId} src={img.imageUrl} alt="추가 이미지" className="w-full h-32 object-cover rounded bg-sky-100" />
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-3 mt-10 justify-end">
          <button
            onClick={() => router.push(`/clothes/${clothesId}/edit`)}
            className="bg-gradient-to-r from-sky-400 to-cyan-400 text-white px-5 py-2 rounded-lg shadow hover:from-sky-500 hover:to-cyan-500 font-semibold"
          >
            수정하기
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 disabled:opacity-50 font-semibold"
          >
            {deleting ? "삭제 중..." : "삭제하기"}
          </button>
        </div>
      </div>
    </div>
  )
}