"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { UpdateClothesSchema } from "@/schemas/clothes"
import { updateClothes, getClothesById } from "@/lib/api/clothes"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import Image from "next/image"
import type { UpdateClothesRequest } from "@/schemas/clothes"

export default function ClothesEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const clothesId = Number(id)

  const [form, setForm] = useState<UpdateClothesRequest>({
    categoryId: 0,
    clothesSize: "M",
    clothesColor: "BLACK",
    description: "",
    images: [],
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [previewImages, setPreviewImages] = useState<{ id: number; url: string }[]>([])

  useEffect(() => {
    if (!clothesId) return
    getClothesById(clothesId).then((res) => {
      if (res.success) {
        const d = res.data
        setForm({
          categoryId: d.categoryId,
          clothesSize: d.clothesSize as UpdateClothesRequest["clothesSize"],
          clothesColor: d.clothesColor as UpdateClothesRequest["clothesColor"],
          description: d.description,
          images: d.clothesImages.map((img) => img.imageId),
        })
        setPreviewImages(
          d.clothesImages.map((img) => ({ id: img.imageId, url: img.url }))
        )
      } else {
        setError(res.message)
      }
    })
  }, [clothesId])

  const handleChange = (field: keyof UpdateClothesRequest, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadingImages(true)
    const newImageIds: number[] = []
    const newPreviews: { id: number; url: string }[] = []
    try {
      for (const file of Array.from(files)) {
        const presignedResult = await createPresignedUrl({
          fileName: file.name,
          type: "clothes",
        })
        if (!presignedResult.success || !presignedResult.data) {
          throw new Error("이미지 업로드 URL 생성 실패")
        }
        const data = presignedResult.data as unknown as import("@/lib/types/image").CreatePresignedUrlSuccessResponse["data"]
        const uploadResponse = await fetch(data.presignedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        })
        if (!uploadResponse.ok) {
          throw new Error("S3 업로드 실패")
        }
        const saveResult = await saveImageMetadata({
          fileName: file.name,
          url: data.fileUrl,
          s3Key: data.s3Key,
          contentType: file.type,
          type: "CLOTHES",
          size: file.size,
        })
        if (saveResult.success && saveResult.data) {
          const imageData = saveResult.data as unknown as import("@/lib/types/image").SaveImageMetadataSuccessResponse["data"]
          newImageIds.push(imageData.id)
          newPreviews.push({ id: imageData.id, url: imageData.url })
        }
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...newImageIds] }))
      setPreviewImages((prev) => [...prev, ...newPreviews])
    } catch (error) {
      setError("이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setUploadingImages(false)
      e.target.value = ""
    }
  }

  const removeImage = (imageId: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((id) => id !== imageId) }))
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const parseResult = UpdateClothesSchema.safeParse(form)
    if (!parseResult.success) {
      setError(parseResult.error.errors[0].message)
      setLoading(false)
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }

    const result = await updateClothes(clothesId, form)
    if (result.success) {
      router.push(`/clothes/${result.data.id}`)
    } else {
      setError(result.message || "수정 실패")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">옷 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">카테고리 ID</label>
          <input
            type="number"
            value={form.categoryId}
            onChange={(e) => handleChange("categoryId", Number(e.target.value))}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">사이즈</label>
          <select
            value={form.clothesSize}
            onChange={(e) => handleChange("clothesSize", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {["XS", "S", "M", "L", "XL", "XXL", "FREE"].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">색상</label>
          <select
            value={form.clothesColor}
            onChange={(e) => handleChange("clothesColor", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            {["BLACK", "WHITE", "RED", "BLUE", "GREEN", "YELLOW", "GRAY", "PINK", "NAVY", "BROWN", "BEIGE"].map((color) => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">설명</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={4}
          />
        </div>
        {/* 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium mb-1">이미지</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploadingImages}
            className="hidden"
            id="edit-images"
          />
          <label htmlFor="edit-images" className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-50">
            {uploadingImages ? "업로드 중..." : "이미지 선택"}
          </label>
          <p className="text-xs text-gray-500 mt-1">이미지 파일을 선택하면 자동으로 업로드됩니다.</p>
          {/* 미리보기 */}
          <div className="mt-2 grid grid-cols-3 gap-2">
            {previewImages.map((img, i) => (
              <div key={img.id} className="relative aspect-square">
                <Image src={img.url} alt={`이미지 ${i + 1}`} fill className="object-cover rounded" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-sky-500 text-white text-xs px-2 py-1 rounded">메인</span>
                )}
                <button type="button" onClick={() => removeImage(img.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                  삭제
                </button>
              </div>
            ))}
          </div>
          {previewImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">* 첫 번째 이미지가 메인 이미지로 설정됩니다.</p>
          )}
          {previewImages.length === 0 && (
            <p className="text-xs text-red-500 mt-1">이미지를 최소 1개 이상 등록해주세요.</p>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 text-white py-2 rounded hover:bg-sky-700 transition"
        >
          {loading ? "수정 중..." : "수정하기"}
        </button>
      </form>
    </div>
  )
}