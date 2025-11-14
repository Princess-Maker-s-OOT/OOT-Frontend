"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateMyInfo } from "@/lib/api/user"
import { UserProfile } from "@/lib/types/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface EditMyInfoFormProps {
  profile: UserProfile
  onSuccess?: () => void
  onCancel?: () => void
}

export default function EditMyInfoForm({ profile, onSuccess, onCancel }: EditMyInfoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    nickname: profile.nickname,
    phoneNumber: profile.phoneNumber || "",
    tradeAddress: profile.tradeAddress,
    tradeLatitude: profile.tradeLatitude,
    tradeLongitude: profile.tradeLongitude,
  })

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