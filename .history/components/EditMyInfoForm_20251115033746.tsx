"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { updateMyInfo, verifyPassword, updateProfileImage, deleteProfileImage } from "@/lib/api/user"
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image"
import { UserProfile } from "@/lib/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload, X, Search, MapPin } from "lucide-react"
import Image from "next/image"

declare global {
  interface Window {
    kakao: any
  }
}

interface EditMyInfoFormProps {
  profile: UserProfile
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EditMyInfoForm({ profile, onSuccess, onCancel }: EditMyInfoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState<"verify" | "edit">("verify")
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [searchingAddress, setSearchingAddress] = useState(false)
  const [password, setPassword] = useState("")
  const [addressSearch, setAddressSearch] = useState("")
  
  const [formData, setFormData] = useState({
    nickname: profile.nickname,
    phoneNumber: profile.phoneNumber || "",
    tradeAddress: profile.tradeAddress,
    tradeLatitude: profile.tradeLatitude,
    tradeLongitude: profile.tradeLongitude,
  })

  const [imageData, setImageData] = useState({
    imageId: null as number | null,
    imageUrl: profile.imageUrl || null,
  })

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script")
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password.trim()) {
      toast({
        title: "입력 오류",
        description: "비밀번호를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const result = await verifyPassword({ password })

      if (result.success) {
        toast({
          title: "인증 성공",
          description: "비밀번호가 확인되었습니다.",
        })
        setStep("edit")
      } else {
        toast({
          title: "인증 실패",
          description: result.message || "비밀번호가 일치하지 않습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("비밀번호 검증 에러:", error)
      toast({
        title: "오류",
        description: "비밀번호 검증 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      // Presigned URL 생성
      const presignedResult = await createPresignedUrl({
        fileName: file.name,
        type: "user",
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
        type: "USER",
        size: file.size,
      })

      if (saveResult.success && saveResult.data) {
        setImageData({
          imageId: saveResult.data.id,
          imageUrl: saveResult.data.url,
        })
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

  const handleRemoveImage = async () => {
    try {
      const result = await deleteProfileImage()
      if (result.success) {
        setImageData({ imageId: null, imageUrl: null })
        toast({
          title: "삭제 성공",
          description: "프로필 이미지가 삭제되었습니다.",
        })
      }
    } catch (error) {
      console.error("이미지 삭제 에러:", error)
      toast({
        title: "삭제 실패",
        description: "이미지 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }

  const searchAddress = async () => {
    if (!addressSearch.trim()) {
      toast({
        title: "입력 오류",
        description: "주소를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    setSearchingAddress(true)

    try {
      if (!window.kakao || !window.kakao.maps) {
        throw new Error("카카오맵 API가 로드되지 않았습니다")
      }

      window.kakao.maps.load(() => {
        const geocoder = new window.kakao.maps.services.Geocoder()

        geocoder.addressSearch(addressSearch, (result: any, status: any) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            const { address_name, y, x } = result[0]
            setFormData({
              ...formData,
              tradeAddress: address_name,
              tradeLatitude: parseFloat(y),
              tradeLongitude: parseFloat(x),
            })
            toast({
              title: "주소 검색 성공",
              description: `${address_name}로 설정되었습니다.`,
            })
          } else {
            toast({
              title: "주소 검색 실패",
              description: "주소를 찾을 수 없습니다. 다시 시도해주세요.",
              variant: "destructive",
            })
          }
          setSearchingAddress(false)
        })
      })
    } catch (error) {
      console.error("주소 검색 에러:", error)
      toast({
        title: "검색 오류",
        description: "주소 검색 중 오류가 발생했습니다.",
        variant: "destructive",
      })
      setSearchingAddress(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nickname.trim()) {
      toast({
        title: "입력 오류",
        description: "닉네임을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!formData.tradeAddress.trim()) {
      toast({
        title: "입력 오류",
        description: "거래 주소를 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // 프로필 이미지 업데이트 (변경된 경우)
      if (imageData.imageId && imageData.imageId !== profile.imageUrl) {
        await updateProfileImage({ imageId: imageData.imageId })
      }

      // 회원 정보 업데이트
      const result = await updateMyInfo({
        nickname: formData.nickname,
        phoneNumber: formData.phoneNumber || null,
        tradeAddress: formData.tradeAddress,
        tradeLatitude: formData.tradeLatitude,
        tradeLongitude: formData.tradeLongitude,
      })

      if (result.success) {
        toast({
          title: "수정 완료",
          description: "회원 정보가 수정되었습니다.",
        })
        onSuccess?.()
      } else {
        toast({
          title: "수정 실패",
          description: result.message || "회원 정보 수정에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("회원 정보 수정 에러:", error)
      toast({
        title: "오류",
        description: "회원 정보 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // 비밀번호 검증 단계
  if (step === "verify") {
    return (
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200">
          <CardTitle className="text-2xl">비밀번호 확인</CardTitle>
          <CardDescription className="text-gray-700">
            회원 정보 수정을 위해 비밀번호를 입력해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleVerifyPassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    확인 중...
                  </>
                ) : (
                  "확인"
                )}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  취소
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  // 회원정보 수정 단계
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-200">
        <CardTitle className="text-2xl">회원 정보 수정</CardTitle>
        <CardDescription className="text-gray-700">
          변경할 정보를 입력해주세요
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임 *</Label>
            <Input
              id="nickname"
              value={formData.nickname}
              onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              placeholder="닉네임을 입력하세요"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">전화번호</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="전화번호를 입력하세요 (선택)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tradeAddress">거래 희망 주소 *</Label>
            <Input
              id="tradeAddress"
              value={formData.tradeAddress}
              onChange={(e) => setFormData({ ...formData, tradeAddress: e.target.value })}
              placeholder="거래 희망 주소를 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tradeLatitude">위도 *</Label>
              <Input
                id="tradeLatitude"
                type="number"
                step="0.000001"
                value={formData.tradeLatitude}
                onChange={(e) => setFormData({ ...formData, tradeLatitude: parseFloat(e.target.value) })}
                placeholder="위도"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tradeLongitude">경도 *</Label>
              <Input
                id="tradeLongitude"
                type="number"
                step="0.000001"
                value={formData.tradeLongitude}
                onChange={(e) => setFormData({ ...formData, tradeLongitude: parseFloat(e.target.value) })}
                placeholder="경도"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1"
              >
                취소
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}