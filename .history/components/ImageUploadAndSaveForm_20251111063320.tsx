"use client"

import { useState } from "react"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import { CreatePresignedUrlSchema, SaveImageMetadataSchema } from "@/lib/validation"
import type { CreatePresignedUrlRequest, SaveImageMetadataRequest } from "@/lib/validation"

export default function ImageUploadAndSaveForm() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState<"CLOSET" | "CLOTHES" | "SALEPOST" | "USER">("CLOSET")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageId, setImageId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUploadAndSave(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPreviewUrl(null)
    setImageId(null)

    if (!file) {
      setError("파일을 선택해주세요.")
      return
    }

    const presignedType = type === "CLOSET" ? "closet" : "clothes"
    const presignedInput: CreatePresignedUrlRequest = {
      fileName: file.name,
      type: presignedType,
    }

    const parsedPresigned = CreatePresignedUrlSchema.safeParse(presignedInput)
    if (!parsedPresigned.success) {
      setError(parsedPresigned.error.errors.map((e) => e.message).join(", "))
      return
    }

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const presigned = await createPresignedUrl(parsedPresigned.data, token)
      if (!("data" in presigned) || !presigned.data) {
        setError((presigned as any)?.message ?? "사전 서명 URL 생성 실패")
        return
      }

      const { presignedUrl, fileUrl, s3Key, expiresIn } = presigned.data

      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      })

      if (!uploadRes.ok) {
        setError("S3 업로드 실패")
        return
      }

      const metadata: SaveImageMetadataRequest = {
        fileName: file.name,
        url: fileUrl,
        s3Key,
        contentType: file.type,
        type,
        size: file.size,
      }

      const parsedMetadata = SaveImageMetadataSchema.safeParse(metadata)
      if (!parsedMetadata.success) {
        setError(parsedMetadata.error.errors.map((e) => e.message).join(", "))
        return
      }

      const saved = await saveImageMetadata(parsedMetadata.data, token)
      if ("data" in saved && saved.data) {
        setPreviewUrl((saved.data as any).url)
        setImageId((saved.data as any).id)
      } else {
        setError((saved as any)?.message ?? "이미지 메타데이터 저장 실패")
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUploadAndSave} className="space-y-6 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold text-sky-700">이미지 업로드 및 저장</h1>

      <div>
        <label className="block text-sm font-medium mb-1">이미지 파일</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">타입</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value as SaveImageMetadataRequest["type"])}
        >
          <option value="CLOSET">CLOSET</option>
          <option value="CLOTHES">CLOTHES</option>
          <option value="SALEPOST">SALEPOST</option>
          <option value="USER">USER</option>
        </select>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {previewUrl && (
        <div className="text-sm text-green-600">
          저장 완료! 이미지 ID: {imageId}
          <img src={previewUrl} alt="업로드된 이미지" className="mt-2 rounded shadow w-full" />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "처리 중..." : "업로드 및 저장"}
        </button>
      </div>
    </form>
  )
}