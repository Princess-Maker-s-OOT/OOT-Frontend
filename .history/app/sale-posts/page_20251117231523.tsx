"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api/client";

type SalePostSummary = {
  salePostId: number;
  title: string;
  price: number;
  status: "AVAILABLE" | "SELLING" | "RESERVED" | "SOLD_OUT";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerNickname: string;
  categoryName: string;
  thumbnailUrl: string | null;
  createdAt: string;
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

import { Suspense } from "react";

function SalePostsPageInner() {
  const [posts, setPosts] = useState<SalePostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    loadPosts();
  }, [categoryId]);

  async function loadPosts() {
    try {
      setLoading(true);
      let url = "/api/v1/sale-posts/public?page=0&size=20";
      if (categoryId) {
        url += `&categoryId=${categoryId}`;
      }
      const result = await apiGet<SalePostListResponse>(url, { requiresAuth: false });
      if (result.success && result.data) {
        setPosts(result.data.content);
          const { isAuthenticated } = useAuth();
      } else {
        setError(result.message || "판매글을 불러올 수 없습니다.");
      }
    } catch (err: any) {
      setError(err?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">판매글 목록</h1>
        <div className="flex gap-2">
          {categoryId && (
            <button
              onClick={() => window.location.href = "/sale-posts"}
              className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              필터 해제
            </button>
          )}
          <a
            href="/sale-posts/new"
            className="bg-sky-100 text-sky-700 text-sm px-4 py-2 rounded hover:bg-sky-200 transition"
          >
            판매글 등록
          </a>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-500">
          판매글을 불러오는 중...
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
                  {isAuthenticated && (
                    <a
                      href="/sale-posts/new"
                      className="bg-sky-100 text-sky-700 text-sm px-4 py-2 rounded hover:bg-sky-200 transition"
                    >
                      판매글 등록
                    </a>
                  )}
            onClick={loadPosts}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600"
          >
            다시 시도
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          등록된 판매글이 없습니다.
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((p) => (
            <Link
              key={p.salePostId}
              href={`/sale-posts/${p.salePostId}`}
              className="block bg-white rounded shadow p-3 border hover:shadow-md transition"
            >
              {p.thumbnailUrl ? (
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  className="h-40 w-full object-cover mb-3 rounded bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="h-40 w-full mb-3 rounded bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">이미지 없음</span>
                </div>
              )}
              <h3 className="text-sm font-semibold mb-1 truncate">{p.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-sky-600 font-bold">₩{p.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500">{p.categoryName}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{p.tradeAddress}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{p.sellerNickname}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  (p.status === "SELLING" || p.status === "AVAILABLE")
                    ? "bg-green-100 text-green-700" 
                    : p.status === "RESERVED"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {(p.status === "SELLING" || p.status === "AVAILABLE") ? "판매중" : p.status === "RESERVED" ? "예약중" : "판매완료"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SalePostsPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SalePostsPageInner />
    </Suspense>
  );
}