"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createCloset } from "@/lib/api/closet"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

export default function CreateClosetForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageId, setImageId] = useState<number | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    name: "",
    description: "",
    isPublic: false,
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      // Presigned URL 생성
      const presignedResult = await createPresignedUrl({
        fileName: file.name,
        type: "closet",
      })

      if (!presignedResult.success || !presignedResult.data) {
        throw new Error("이미지 업로드 URL 생성 실패")
      }

      // S3에 업로드
      const uploadResponse = await fetch(presignedResult.data.presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error("S3 업로드 실패")
      }

      // 메타데이터 저장
      const saveResult = await saveImageMetadata({
        fileName: presignedResult.data.fileName,
        url: presignedResult.data.fileUrl,
        s3Key: presignedResult.data.s3Key,
        contentType: file.type,
        type: "CLOSET",
        size: file.size,
      })

      if (saveResult.success && saveResult.data) {
        setImageId(saveResult.data.id)
        setImagePreview(saveResult.data.url)
        toast({
          title: "업로드 성공",
          description: "이미지가 업로드되었습니다.",
        })
      }
    } catch (error) {
      console.error("이미지 업로드 에러:", error)
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
      e.target.value = ""
    }
  }

  const removeImage = () => {
    setImageId(null)
    setImagePreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name.trim()) {
      toast({
        title: "입력 오류",
        description: "옷장 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!imageId) {
      toast({
        title: "입력 오류",
        description: "이미지를 업로드해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const result = await createCloset({
        name: form.name,
        description: form.description,
        imageId: imageId,
        isPublic: form.isPublic,
      })

      if (result.success) {
        toast({
          title: "등록 성공",
          description: "옷장이 등록되었습니다.",
        })
        router.push("/my?tab=closet")
      } else {
        toast({
          title: "등록 실패",
          description: result.message || "옷장 등록에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("옷장 등록 에러:", error)
      toast({
        title: "오류",
        description: "옷장 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200">
          <CardTitle className="text-2xl">옷장 등록</CardTitle>
          <CardDescription className="text-gray-700">
            내 옷을 모아두는 새로운 옷장을 만드세요
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 옷장 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">옷장 이름 *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="예: 겨울 옷장, 여름 옷장"
                required
              />
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="옷장에 대한 설명을 입력하세요"
                rows={4}
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label>옷장 이미지 *</Label>
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

            {/* 공개 여부 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                checked={form.isPublic}
                onCheckedChange={(checked) => setForm({ ...form, isPublic: checked as boolean })}
              />
              <Label htmlFor="isPublic" className="cursor-pointer">
                공개 옷장으로 설정 (다른 사람들이 볼 수 있습니다)
              </Label>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex-1 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    등록 중...
                  </>
                ) : (
                  "등록하기"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}