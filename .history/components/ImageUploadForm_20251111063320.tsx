"use client"

import { useState } from "react"
import { CreatePresignedUrlSchema } from "@/lib/validation"
import { createPresignedUrl } from "@/lib/api/image"
import type { CreatePresignedUrlRequest } from "@/lib/validation"

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState<"closet" | "clothes">("closet")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPreviewUrl(null)

    if (!file) {
      setError("파일을 선택해주세요.")
      return
    }

    const parsed = CreatePresignedUrlSchema.safeParse({
      fileName: file.name,
      type,
    })

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
      const presigned = await createPresignedUrl(parsed.data, token)
      if (!("data" in presigned) || !presigned.data) {
        setError((presigned as any)?.message ?? "사전 서명 URL 생성 실패")
        return
      }

      const { presignedUrl, fileUrl } = presigned.data

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

      setPreviewUrl(fileUrl)
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-6 bg-white p-6 rounded shadow max-w-md mx-auto">
      <h1 className="text-xl font-bold text-sky-700">이미지 업로드</h1>

      <div>
        <label className="block text-sm font-medium mb-1">이미지 파일</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">타입</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={type}
          onChange={(e) => setType(e.target.value as "closet" | "clothes")}
        >
          <option value="closet">closet</option>
          <option value="clothes">clothes</option>
        </select>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      {previewUrl && (
        <div className="text-sm text-green-600">
          업로드 완료! <br />
          <img src={previewUrl} alt="업로드된 이미지" className="mt-2 rounded shadow w-full" />
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "업로드 중..." : "업로드"}
        </button>
      </div>
    </form>
  )
}