"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClothes } from "@/lib/api/clothes"
import { getCategories, buildCategoryTree, type CategoryNode } from "@/lib/api/categories"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import CategorySelector from "@/components/CategorySelector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface CreateClothesForm {
  categoryId: number | null
  clothesSize: string
  clothesColor: string
  description: string
  images: number[]
}

export default function ClothesNewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [previewImages, setPreviewImages] = useState<{ id: number; url: string }[]>([])
  
  const [form, setForm] = useState<CreateClothesForm>({
    categoryId: null,
    clothesSize: "",
    clothesColor: "",
    description: "",
    images: [],
  })

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      const result = await getCategories(0, 200)
      if (result.success && result.data) {
        const tree = buildCategoryTree(result.data.content)
        setCategories(tree)
      }
    } catch (err) {
      console.error("카테고리 로드 실패:", err)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const newImageIds: number[] = []
    const newPreviews: { id: number; url: string }[] = []

    try {
      for (const file of Array.from(files)) {
        // Presigned URL 생성
        const presignedResult = await createPresignedUrl({
          fileName: file.name,
          type: "clothes",
        })

        if (
          !presignedResult.success ||
          !presignedResult.data ||
          typeof presignedResult.data.presignedUrl !== "string" ||
          typeof presignedResult.data.fileUrl !== "string" ||
          typeof presignedResult.data.s3Key !== "string"
        ) {
          throw new Error("이미지 업로드 URL 생성 실패")
        }

        // S3에 업로드
        const uploadResponse = await fetch(presignedResult.data.presignedUrl as string, {
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
          fileName: file.name,
          url: presignedResult.data.fileUrl,
          s3Key: presignedResult.data.s3Key,
          contentType: file.type,
          type: "CLOTHES",
          size: file.size,
        })

        if (saveResult.success && saveResult.data) {
          newImageIds.push(saveResult.data.id)
          newPreviews.push({
            id: saveResult.data.id,
            url: saveResult.data.url,
          })
        }
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageIds],
      }))
      setPreviewImages((prev) => [...prev, ...newPreviews])

      toast({
        title: "업로드 성공",
        description: `${newImageIds.length}개의 이미지가 업로드되었습니다.`,
      })
    } catch (error) {
      console.error("이미지 업로드 에러:", error)
      toast({
        title: "업로드 실패",
        description: "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setUploadingImages(false)
      e.target.value = ""
    }
  }

  const removeImage = (imageId: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((id) => id !== imageId),
    }))
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.categoryId === null) {
      toast({
        title: "입력 오류",
        description: "카테고리를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!form.clothesSize) {
      toast({
        title: "입력 오류",
        description: "사이즈를 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!form.clothesColor) {
      toast({
        title: "입력 오류",
        description: "색상을 선택해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!form.description.trim()) {
      toast({
        title: "입력 오류",
        description: "설명을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const result = await createClothes({
        categoryId: form.categoryId,
        clothesSize: form.clothesSize,
        clothesColor: form.clothesColor,
        description: form.description,
        images: form.images,
      })

      if (result.success && result.data) {
        toast({
          title: "등록 성공",
          description: "옷이 등록되었습니다.",
        })
        router.push(`/clothes/${result.data.id}`)
      } else {
        toast({
          title: "등록 실패",
          description: result.message || "옷 등록에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("옷 등록 에러:", error)
      toast({
        title: "오류",
        description: "옷 등록 중 오류가 발생했습니다.",
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
          <CardTitle className="text-2xl">옷 등록</CardTitle>
          <CardDescription className="text-gray-700">
            내 옷장에 새로운 옷을 추가하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 카테고리 선택 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <CategorySelector
                categories={categories}
                onSelect={(categoryId) => setForm({ ...form, categoryId })}
              />
            </div>

            {/* 사이즈 */}
            <div className="space-y-2">
              <Label htmlFor="size">사이즈 *</Label>
              <Select
                value={form.clothesSize}
                onValueChange={(value) => setForm({ ...form, clothesSize: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="사이즈를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                  <SelectItem value="FREE">FREE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 색상 */}
            <div className="space-y-2">
              <Label htmlFor="color">색상 *</Label>
              <Select
                value={form.clothesColor}
                onValueChange={(value) => setForm({ ...form, clothesColor: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="색상을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BLACK">흑색</SelectItem>
                  <SelectItem value="WHITE">흰색</SelectItem>
                  <SelectItem value="RED">빨간색</SelectItem>
                  <SelectItem value="BLUE">파란색</SelectItem>
                  <SelectItem value="GREEN">초록색</SelectItem>
                  <SelectItem value="YELLOW">노란색</SelectItem>
                  <SelectItem value="GRAY">회색</SelectItem>
                  <SelectItem value="PINK">분홍색</SelectItem>
                  <SelectItem value="NAVY">네이비</SelectItem>
                  <SelectItem value="BROWN">갈색</SelectItem>
                  <SelectItem value="BEIGE">베이지</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명 *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="옷에 대한 설명을 입력하세요"
                rows={4}
                required
              />
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label>이미지</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImages}
                  className="hidden"
                />
                <label
                  htmlFor="images"
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    {uploadingImages ? "업로드 중..." : "클릭하여 이미지 업로드"}
                  </p>
                  <p className="text-xs text-gray-500">여러 장 선택 가능</p>
                </label>
              </div>

              {/* 이미지 미리보기 */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {previewImages.map((img) => (
                    <div key={img.id} className="relative aspect-square">
                      <Image
                        src={img.url}
                        alt="업로드된 이미지"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || uploadingImages}
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