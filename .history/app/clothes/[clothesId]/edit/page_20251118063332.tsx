"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { UpdateClothesSchema } from "@/schemas/clothes"
import { updateClothes, getClothesById } from "@/lib/api/clothes"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import Image from "next/image"
import type { UpdateClothesRequest } from "@/schemas/clothes"
import { getCategories, buildCategoryTree, type CategoryNode } from "@/lib/api/categories"
import CategorySelector from "@/components/CategorySelector"

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
  const [categories, setCategories] = useState<CategoryNode[]>([])

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
    // 카테고리 로드
    getCategories(0, 200).then((result) => {
      if (result.success && result.data) {
        const tree = buildCategoryTree(result.data.content)
        setCategories(tree)
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
        {/* 카테고리 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">카테고리 *</label>
          <CategorySelector
            categories={categories}
            onSelect={(categoryId) => setForm((prev) => ({ ...prev, categoryId }))}
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
        <div className="space-y-2">
          <label>이미지</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-400 transition-colors">
            <input
              type="file"
              id="edit-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImages}
              className="hidden"
            />
            <label
              htmlFor="edit-images"
              className="flex flex-col items-center justify-center cursor-pointer py-4"
            >
              <Image src="/upload.svg" width={40} height={40} alt="업로드" className="mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {uploadingImages ? "업로드 중..." : "클릭하여 이미지 업로드"}
              </p>
              <p className="text-xs text-gray-500">여러 장 선택 가능</p>
            </label>
          </div>
          {/* 이미지 미리보기 */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {previewImages.map((img, index) => (
                <div key={img.id} className="relative aspect-square">
                  <Image
                    src={img.url}
                    alt="업로드된 이미지"
                    fill
                    className="object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-sky-500 text-white text-xs px-2 py-1 rounded">
                      메인
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
          {previewImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              * 첫 번째 이미지가 메인 이미지로 설정됩니다.
            </p>
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