"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UpdateProfileImageSchema } from "@/lib/validation"
import { updateProfileImage } from "@/lib/api/user"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import type { UpdateProfileImageRequest } from "@/lib/validation"

export default function UpdateProfileImageForm() {
  const router = useRouter()
  const [imageId, setImageId] = useState<number | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setUploading(true)
    setError(null)

    try {
      // 1. Presigned URL 생성
      const presigned = await createPresignedUrl({
        fileName: file.name,
        type: "user",
      })

      if (!presigned.success || !presigned.data) {
        setError(presigned.message || "이미지 업로드 URL 생성 실패")
        return
      }

      const { presignedUrl, fileUrl, s3Key } = presigned.data as unknown as import("@/lib/types/image").CreatePresignedUrlSuccessResponse["data"];

      // 2. S3에 업로드
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!uploadRes.ok) {
        setError("이미지 업로드 실패")
        return
      }

      // 3. 이미지 메타데이터 저장
      const saveResult = await saveImageMetadata({
        fileName: file.name,
        url: fileUrl,
        s3Key: s3Key,
        contentType: file.type,
        type: "USER",
        size: file.size
      })

      if (!saveResult.success || !saveResult.data) {
        setError("이미지 메타데이터 저장 실패")
        return
      }

      // 4. imageId 저장
      const imageData = saveResult.data as unknown as import("@/lib/types/image").SaveImageMetadataSuccessResponse["data"];
      setImageId(imageData.id)
      setImageUrl(fileUrl)
      setSuccess("이미지 업로드 성공! 이제 '프로필 이미지 수정' 버튼을 눌러주세요.")
    } catch (err: any) {
      setError(err?.message || "이미지 업로드 중 오류 발생")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)


    // imageId 유효성 체크
    if (!imageId || typeof imageId !== "number" || imageId <= 0) {
      setError("이미지 업로드에 실패했습니다. 다시 업로드해 주세요.")
      return
    }

    const parsed = UpdateProfileImageSchema.safeParse({ imageId })
    if (!parsed.success) {
      setError(parsed.error.errors.map((e) => e.message).join(", "))
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await updateProfileImage(parsed.data)
      if (result.success) {
        setSuccess("프로필 이미지가 수정되었습니다.")
        setTimeout(() => {
          router.push("/my")
        }, 1500)
      } else {
        setError(result.message || "이미지 수정 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold text-sky-700">프로필 이미지 수정</h1>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium mb-2">이미지 업로드</label>
        <label className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? "업로드 중..." : "이미지 선택"}
        </label>
        <p className="text-xs text-gray-500 mt-2">
          이미지 파일을 선택하면 자동으로 업로드됩니다.
        </p>
      </div>

      {/* 업로드된 이미지 미리보기 */}
      {imageUrl && (
        <div className="border rounded p-4">
          <img src={imageUrl} alt="프로필 이미지" className="w-32 h-32 object-cover rounded mx-auto" />
          <p className="text-xs text-center text-gray-500 mt-2">Image ID: {imageId}</p>
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}
      {success && <div className="text-sm text-green-600">{success}</div>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => router.push("/my")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={loading || !imageId}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "수정 중..." : "프로필 이미지 수정"}
        </button>
      </div>
    </form>
  )
}