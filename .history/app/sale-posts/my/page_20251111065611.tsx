"use client"

import React from "react"
import { mySalePostListResponse } from "@/lib/mock/mySalePosts" // ✅ 목데이터 import

export default function MySalePostsPage() {
  const data = mySalePostListResponse
  const posts = (data?.data?.content ?? []) as unknown as any[]

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">내 판매글</h1>

      {posts.length === 0 ? (
        <div className="text-gray-500 text-sm">등록된 판매글이 없습니다.</div>
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <a
              key={p.salePostId}
              href={`/sale-posts/${p.salePostId}`}
              className="block bg-white rounded shadow p-4 border hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{p.title}</h3>
                <span className="text-xs text-gray-500">{p.status}</span>
              </div>
              <div className="text-sm text-gray-400">
                ₩{p.price.toLocaleString()} · {p.tradeAddress}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}