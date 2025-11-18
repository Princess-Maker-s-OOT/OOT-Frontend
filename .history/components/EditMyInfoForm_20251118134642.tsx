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
     imageId: profile.imageId ?? null,
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
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      // 프로필은 1장만 허용
      const file = files[0];
      const presigned = await createPresignedUrl({
        fileName: file.name,
        type: "user"
      });
      if (!presigned.success || !presigned.data) {
        throw new Error(presigned.message || "이미지 업로드 URL 생성 실패");
      }
      const { presignedUrl, fileUrl, s3Key } = presigned.data as { presignedUrl: string; fileUrl: string; s3Key: string };
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("이미지 업로드 실패");
      }
      const saveResult = await saveImageMetadata({
        fileName: file.name,
        url: fileUrl,
        s3Key: s3Key,
        contentType: file.type,
        type: "USER",
        size: file.size
      });
      if (saveResult.success && saveResult.data) {
        const imageData = saveResult.data;
        setImageData({
          imageId: imageData.id,
          imageUrl: imageData.url,
        });
        toast({
          title: "업로드 성공",
          description: "이미지가 업로드되었습니다.",
        });
      }
    } catch (err: any) {
      toast({
        title: "업로드 실패",
        description: err?.message || "이미지 업로드 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
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
              address: address_name,
              latitude: parseFloat(y),
              longitude: parseFloat(x),
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

    if (!(formData.address ?? "").trim()) {
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
      if (
        imageData.imageId &&
        typeof imageData.imageId === "number" &&
        imageData.imageId > 0 &&
          imageData.imageId !== profile.imageId
      ) {
        const imgResult = await updateProfileImage({ imageId: imageData.imageId })
        console.log("프로필 이미지 수정 응답:", imgResult)
        if (!imgResult.success) {
          toast({
            title: "프로필 이미지 수정 실패",
            description: imgResult.message || "이미지 수정에 실패했습니다.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      // phoneNumber 빈 문자열이면 undefined로 전송
      const phoneValue = formData.phoneNumber?.trim() ? formData.phoneNumber : undefined
      const reqData = {
        nickname: formData.nickname,
        phoneNumber: phoneValue,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
      }
      console.log("회원 정보 수정 요청 데이터:", reqData)
      const result = await updateMyInfo(reqData)
      console.log("회원 정보 수정 응답:", result)

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
          {/* 프로필 이미지 */}
          <div className="space-y-2">
            <Label>프로필 이미지</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-400 transition-colors">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              <label
                htmlFor="profileImage"
                className="flex flex-col items-center justify-center cursor-pointer py-4"
              >
                {imageData.imageUrl ? (
                  <div className="relative w-24 h-24 mb-2">
                    <Image
                      src={imageData.imageUrl}
                      alt="프로필 이미지"
                      fill
                      className="object-cover rounded-full"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <Upload className="h-10 w-10 text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600 mb-1">
                  {uploadingImage ? "업로드 중..." : "클릭하여 이미지 업로드"}
                </p>
                <p className="text-xs text-gray-500">1장만 선택 가능</p>
              </label>
            </div>
          </div>

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

          {/* 주소 검색 */}
          <div className="space-y-2">
            <Label htmlFor="addressSearch">거래 희망 주소 검색 *</Label>
            <div className="flex gap-2">
              <Input
                id="addressSearch"
                value={addressSearch}
                onChange={(e) => setAddressSearch(e.target.value)}
                placeholder="예: 서울시 강남구 역삼동"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    searchAddress()
                  }
                }}
              />
              <Button
                type="button"
                onClick={searchAddress}
                disabled={searchingAddress}
                className="flex-shrink-0"
              >
                {searchingAddress ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <><Search className="h-4 w-4 mr-2" />검색</>
                )}
              </Button>
            </div>
          </div>

          {/* 선택된 주소 표시 */}
          {formData.tradeAddress && (
            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-sky-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-sky-900">{formData.address}</p>
                  <p className="text-xs text-sky-700 mt-1">
                    위도: {formData.latitude?.toFixed(6)}, 경도: {formData.longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || uploadingImage}
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