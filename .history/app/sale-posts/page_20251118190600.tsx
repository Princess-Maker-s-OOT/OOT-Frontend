"use client";

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { getCategories, buildCategoryTree, type CategoryNode } from "@/lib/api/categories";
import CategorySidebar from "@/components/category-sidebar";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { apiGet } from "@/lib/api/client";
import { getMyInfo } from "@/lib/api/user";

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
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const result = await getCategories(0, 200);
        if (result.success && result.data) {
          setCategories(buildCategoryTree(result.data.content));
        }
      } catch (err) {
        // ignore
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);
  const [posts, setPosts] = useState<SalePostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTitle, setSearchTitle] = useState("");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [searchTitle]);

  async function loadPosts() {
    try {
      setLoading(true);
      let userLat = null, userLng = null;
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        const userRes = await getMyInfo();
        if (userRes.success && userRes.data) {
          userLat = userRes.data.tradeLatitude;
          userLng = userRes.data.tradeLongitude;
        }
      }
      // 제목 검색만 반영
      const salePostsRes = await apiGet<SalePostListResponse>(
        `/api/v1/sale-posts/public?page=0&size=20${searchTitle ? `&title=${encodeURIComponent(searchTitle)}` : ""}${userLat !== null && userLng !== null ? `&lat=${userLat}&lng=${userLng}` : ""}`,
        { requiresAuth: false }
      );
      if (salePostsRes.success && salePostsRes.data) {
        setPosts(salePostsRes.data.content);
      } else {
        setError(salePostsRes.message || "판매글을 불러올 수 없습니다.");
      }
    } catch (err: any) {
      setError(err?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-semibold">판매글 목록</h1>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            placeholder="제목으로 검색..."
            className="border px-3 py-2 rounded text-sm w-48"
          />
          <button
            onClick={() => setSearchTitle("")}
            className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded hover:bg-gray-200 transition"
            disabled={!searchTitle}
          >
            검색 초기화
          </button>
          {isAuthenticated && (
            <a
              href="/sale-posts/new"
              className="bg-sky-100 text-sky-700 text-sm px-4 py-2 rounded hover:bg-sky-200 transition"
            >
              판매글 등록
            </a>
          )}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.salePostId} href={`/sale-posts/${p.salePostId}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg truncate">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  {p.thumbnailUrl ? (
                    <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={p.thumbnailUrl}
                        alt={p.title}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">이미지 없음</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-cyan-600 font-extrabold text-lg">₩{p.price.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">{p.categoryName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.tradeAddress}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.sellerNickname}</span>
                  <span className={`px-2 py-1 rounded font-semibold ${
                    (p.status === "SELLING" || p.status === "AVAILABLE")
                      ? "bg-green-100 text-green-700" 
                      : p.status === "RESERVED"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {(p.status === "SELLING" || p.status === "AVAILABLE") ? "판매중" : p.status === "RESERVED" ? "예약중" : "판매완료"}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
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