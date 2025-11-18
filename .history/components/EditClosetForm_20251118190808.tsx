"use client"

import { useState, useEffect } from "react"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import { Button } from "@/components/ui/button"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { UpdateClosetSchema } from "@/lib/validation"
import { updateCloset, getClosetById } from "@/lib/api/closet"
import type { UpdateClosetRequest } from "@/lib/validation"
import type { ClosetDetailData } from "@/lib/types/closet"

interface Props {
  closetId: number
}

export default function EditClosetForm({ closetId }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<UpdateClosetRequest>({
    name: "",
    description: "",
    imageId: 0,
    isPublic: false,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof closetId === "number" && !isNaN(closetId)) {
      getClosetById(closetId).then((res) => {
        if ("data" in res && res.data) {
          const { name, description, imageUrl, isPublic, imageId } = res.data
          setForm({
            name,
            description,
            imageId: imageId || 0,
            isPublic,
          })
          if (imageUrl) setImagePreview(imageUrl)
        } else {
          setError((res as any)?.message ?? "오류가 발생했습니다.")
        }
      })
    } else {
      setError("옷장 ID가 올바르지 않습니다.")
    }
  }, [closetId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!form.name.trim()) {
      setError("옷장 이름을 입력해주세요.")
      return
    }
    if (!form.imageId) {
      setError("이미지를 업로드해주세요.")
      return
    }

    const parsed = UpdateClosetSchema.safeParse(form)
    if (!parsed.success) {
      setError(parsed.error.errors.map((e) => e.message).join(", "))
      return
    }

    setLoading(true)
    try {
      const result = await updateCloset(closetId, parsed.data)
      if ((result as any)?.success) {
        setSuccess("옷장 정보가 수정되었습니다.")
        router.push(`/closets/${closetId}`)
      } else {
        setError((result as any)?.message ?? "수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const presignedResult = await createPresignedUrl({
        fileName: file.name,
        type: "closet",
      })
      if (!presignedResult.success || !presignedResult.data) {
        throw new Error(presignedResult.message || "이미지 업로드 URL 생성 실패")
      }
      const data = presignedResult.data as any
      const uploadResponse = await fetch(data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      })
      if (!uploadResponse.ok) throw new Error("S3 업로드 실패")
      const saveResult = await saveImageMetadata({
        fileName: file.name,
        url: data.fileUrl,
        s3Key: data.s3Key,
        contentType: file.type,
        type: "CLOSET",
        size: file.size,
      })
      if (saveResult.success && saveResult.data) {
        const imageData = saveResult.data as any
        setForm(f => ({ ...f, imageId: imageData.id }))
        setImagePreview(imageData.url)
      } else {
        throw new Error(saveResult.message || "이미지 메타데이터 저장 실패")
      }
    } catch (error: any) {
      setError(error?.message || "이미지 업로드 중 오류가 발생했습니다.")
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const removeImage = () => {
    setForm(f => ({ ...f, imageId: 0 }))
    setImagePreview(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-xl mx-auto">
      {/* <h1 className="text-xl font-bold text-sky-700">옷장 정보 수정</h1> */}

      <div>
        <label className="block text-sm font-medium mb-1">옷장 이름</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명</label>
        <textarea
          className="w-full border rounded px-3 py-2"
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* 이미지 업로드 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium mb-1">옷장 이미지 *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-400 transition-colors">
          {imagePreview ? (
            <div className="relative aspect-video w-full max-w-md mx-auto">
              <Image
                src={imagePreview}
                alt="옷장 이미지"
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center cursor-pointer py-8"
              >
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  {uploadingImage ? "업로드 중..." : "클릭하여 이미지 업로드"}
                </p>
                <p className="text-xs text-gray-500">옷장을 대표하는 이미지 1장</p>
              </label>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
        />
        <label className="text-sm">공개 여부</label>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {loading ? "수정 중..." : "수정 완료"}
        </Button>
      </div>
    </form>
  )
}