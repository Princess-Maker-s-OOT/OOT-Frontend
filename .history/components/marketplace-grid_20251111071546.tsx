"use client"

import Image from "next/image"
import Link from "next/link"
import React from "react"
import { AccessibleList, AccessibleListItem } from "./ui/accessible"
import { LoadingState } from "./ui/loading-state"
import { STYLE_CONSTANTS } from "@/lib/constants/styles"
import { cn } from "@/lib/utils"

export type SalePost = {
  id: string
  title: string
  price: string
  firstImageUrl: string
  status?: string
  tradeAddress?: string
}

interface MarketplaceGridProps {
  posts: SalePost[]
  isLoading?: boolean
  error?: string
  onRetry?: () => void
}

export default function MarketplaceGrid({ posts, isLoading, error, onRetry }: MarketplaceGridProps) {
  return (
    <LoadingState isLoading={isLoading} error={error} onRetry={onRetry}>
      <section className="w-full" aria-label="상품 목록">
        <AccessibleList className={STYLE_CONSTANTS.GRID.COLS_4}>
          {posts.map((post) => (
            <AccessibleListItem key={post.id}>
              <article className={cn(STYLE_CONSTANTS.CARD.HOVER, "overflow-hidden bg-gradient-to-br from-white to-oot-sky-50 border border-oot-sky-200 shadow-sm hover:shadow-md hover:border-oot-sky-300 transition-all")}>
                <Link 
                  href={`/sale-posts/${post.id}`} 
                  className="block"
                  aria-label={`${post.title} - ${post.price}${post.status ? `, ${post.status}` : ""}`}
                >
                  <div className="relative h-56 w-full bg-oot-sky-100">
                    <Image 
                      src={post.firstImageUrl} 
                      alt={post.title} 
                      fill 
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw" 
                      className="object-cover"
                    />
                  </div>
                  <div className={STYLE_CONSTANTS.PADDING.SM}>
                    <h4 className="text-sm font-semibold text-foreground mb-2 truncate">{post.title}</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-oot-sky-accent font-bold">{post.price}</p>
                      {post.status && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full bg-oot-sky-100 text-oot-sky-accent font-semibold"
                          role="status"
                        >
                          {post.status}
                        </span>
                      )}
                    </div>
                    {post.tradeAddress && (
                      <p className="text-xs text-gray-500 mt-2">
                        <span className="sr-only">거래 희망 장소:</span>
                        {post.tradeAddress}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            </AccessibleListItem>
          ))}
        </AccessibleList>
      </section>
    </LoadingState>
  )
}
