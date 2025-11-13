"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LoadingState } from "@/components/ui/loading-state"
import { Accessible } from "@/components/ui/accessible"
import { STYLE_CONSTANTS } from "@/lib/constants/styles"
import { cn } from "@/lib/utils"
import { ArrowLeft, Heart, Share2 } from "lucide-react"

interface SalePostDetailProps {
  id: number
  title: string
  price: string
  images: string[]
  status: "판매 중" | "예약 중" | "거래 완료"
  tradeAddress: string
  description: string
  category: string
  condition: string
  seller: {
    name: string
    rating: number
  }
  createdAt: string
}

interface SalePostDetailLoadingProps {
  isLoading?: boolean
  error?: string
  onRetry?: () => void
}

export default function SalePostDetail({
  id,
  title,
  price,
  images,
  status,
  tradeAddress,
  description,
  category,
  condition,
  seller,
  createdAt,
  isLoading,
  error,
  onRetry,
}: SalePostDetailProps & SalePostDetailLoadingProps) {
  const getStatusBadgeVariant = (status: SalePostDetailProps["status"]) => {
    switch (status) {
      case "판매 중":
        return "default"
      case "예약 중":
        return "secondary"
      case "거래 완료":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LoadingState isLoading={isLoading} error={error} onRetry={onRetry}>
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-black bg-background" role="banner">
          <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "flex h-16 items-center gap-4")}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-black hover:text-white"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="logo-fluffy text-2xl font-bold tracking-wide">O.O.T</span>
          </div>
        </header>

        {/* Main Content */}
      <main className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, STYLE_CONSTANTS.PADDING.MD)} role="main">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <Accessible as="section" aria-label="상품 이미지" className="space-y-4">
            <Card className="overflow-hidden border-black">
              <img 
                src={images[0] || "/placeholder.svg"} 
                alt={title} 
                className="aspect-square w-full object-cover" 
                loading="eager"
              />
            </Card>
            {images.length > 1 && (
              <div 
                className="grid grid-cols-4 gap-2" 
                role="list" 
                aria-label="추가 상품 이미지"
              >
                {images.slice(1).map((image, index) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden border-black cursor-pointer hover:opacity-80"
                    role="listitem"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${title} 이미지 ${index + 2}`}
                      className="aspect-square w-full object-cover"
                      loading="lazy"
                    />
                  </Card>
                ))}
              </div>
            )}
          </Accessible>

          {/* Product Details */}
          <Accessible as="section" className="space-y-6" aria-label="상품 정보">
            {/* Title and Status */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-balance font-sans text-2xl font-bold md:text-3xl">{title}</h1>
                <Badge 
                  variant={getStatusBadgeVariant(status)} 
                  className="border-black bg-white text-black shrink-0"
                  role="status"
                >
                  {status}
                </Badge>
              </div>
              <p className="font-mono text-3xl font-bold" aria-label="가격">{price}</p>
            </div>

            {/* Seller Info */}
            <Card className="border-black p-4">
              <Accessible as="div" role="article" aria-label="판매자 정보">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="sr-only">판매자 </span>
                      평점: {seller.rating}/5.0
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-black hover:bg-black hover:text-white bg-transparent"
                    aria-label={`${seller.name} 프로필 보기`}
                  >
                    프로필 보기
                  </Button>
                </div>
              </Accessible>
            </Card>

            {/* Product Info */}
            <dl className="space-y-3 border-t border-black pt-6">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">카테고리</dt>
                <dd className="font-medium">{category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">상태</dt>
                <dd className="font-medium">{condition}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">거래 지역</dt>
                <dd className="font-medium">{tradeAddress}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">등록일</dt>
                <dd className="font-medium">{createdAt}</dd>
              </div>
            </dl>

            {/* Description */}
            <div className="space-y-2 border-t border-black pt-6">
              <h2 className="font-semibold text-lg" id="description">상품 설명</h2>
              <p 
                className="text-pretty leading-relaxed text-muted-foreground"
                aria-labelledby="description"
              >
                {description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-black pt-6">
              <Button
                variant="outline"
                size="icon"
                className="border-black hover:bg-black hover:text-white bg-transparent"
                aria-label="찜하기"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-black hover:bg-black hover:text-white bg-transparent"
                aria-label="공유하기"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button 
                className="flex-1 bg-black text-white hover:bg-black/90"
                aria-label="판매자에게 구매 문의하기"
              >
                구매 문의하기
              </Button>
            </div>
          </Accessible>
        </div>
      </main>
      </LoadingState>
    </div>
  )
}