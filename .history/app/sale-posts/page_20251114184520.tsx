"use client";

import React, { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/client";

type SalePostSummary = {
  salePostId: number;
  title: string;
  price: number;
  status: "AVAILABLE" | "SOLD" | "RESERVED";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerNickname: string;
  categoryName: string;
  createdAt: string;
  imageUrl: string;
};

type SalePostListResponse = {
  content: SalePostSummary[];
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export default function SalePostsPage() {
  const [posts, setPosts] = useState<SalePostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const result = await apiGet<SalePostListResponse>(
        "/api/v1/sale-posts?page=0&size=20",
        { requiresAuth: true }
      );

      if (result.success && result.data) {
        setPosts(result.data.content);
      } else {
        setError(result.message || "판매글을 불러올 수 없습니다.");
      }
    } catch (err: any) {
      console.error("판매글 로드 실패:", err);
      setError(err?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">판매글 목록</h1>
        <a
          href="/sale-posts/new"
          className="bg-sky-100 text-sky-700 text-sm px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          판매글 등록
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((p) => (
          <a
            key={p.salePostId}
            href={`/sale-posts/${p.salePostId}`}
            className="block bg-white rounded shadow p-3 border hover:shadow-md transition"
          >
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-40 w-full object-cover mb-3 rounded bg-gray-100"
            />
            <h3 className="text-sm font-semibold mb-1 truncate">{p.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sky-600 font-bold">₩{p.price.toLocaleString()}</span>
              <span className="text-xs text-gray-500">{p.categoryName}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{p.tradeAddress}</p>
          </a>
        ))}
      </div>
    </div>
  );
}