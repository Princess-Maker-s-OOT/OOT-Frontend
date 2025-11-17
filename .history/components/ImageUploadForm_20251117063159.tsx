"use client"

import { useState } from "react"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"

export default function ImageUploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState<"closet" | "clothes" | "salepost" | "user">("closet")
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

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      // 1. Presigned URL 생성
      const presigned = await createPresignedUrl({
        fileName: file.name,
        type:
          type === "user"
            ? "USER"
            : type === "clothes"
            ? "CLOTHES"
            : type === "closet"
            ? "CLOSET"
            : "SALEPOST"
      })

      if (!presigned.success || !presigned.data) {
        setError(presigned.message || "사전 서명 URL 생성 실패")
        return
      }

      const { presignedUrl, fileUrl, s3Key } = presigned.data

      // 2. S3에 업로드
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

      // 3. 이미지 메타데이터 저장
      const saveResult = await saveImageMetadata({
        fileName: file.name,
        url: fileUrl,
        s3Key: s3Key,
        contentType: file.type,
        type:
          type === "user"
            ? "USER"
            : type === "clothes"
            ? "CLOTHES"
            : type === "closet"
            ? "CLOSET"
            : "SALEPOST",
        size: file.size
      })

      if (!saveResult.success) {
        console.warn("이미지 메타데이터 저장 실패:", saveResult.message)
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
          onChange={(e) => setType(e.target.value as "closet" | "clothes" | "salepost" | "user")}
        >
          <option value="closet">closet (옷장)</option>
          <option value="clothes">clothes (옷)</option>
          <option value="salepost">salepost (판매글)</option>
          <option value="user">user (프로필)</option>
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