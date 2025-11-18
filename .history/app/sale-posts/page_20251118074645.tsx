"use client";

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
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const { isAuthenticated } = useAuth();

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
        // 사용자 거래 희망 위치 정보 가져오기
        const userRes = await getMyInfo();
        let userLat = null, userLng = null;
        if (userRes.success && userRes.data) {
          userLat = userRes.data.tradeLatitude;
          userLng = userRes.data.tradeLongitude;
        }
        let sortedPosts = result.data.content;
        if (userLat !== null && userLng !== null) {
          // 거리 계산 함수
          function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
            const R = 6371; // km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          }
          sortedPosts = [...sortedPosts].sort((a, b) => {
            const distA = getDistance(userLat, userLng, a.tradeLatitude, a.tradeLongitude);
            const distB = getDistance(userLat, userLng, b.tradeLatitude, b.tradeLongitude);
            return distA - distB;
          });
        }
        setPosts(sortedPosts);
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
    <div className="max-w-7xl mx-auto p-6 flex gap-8">
      {/* 카테고리 사이드바 */}
      <aside className="hidden md:block w-64">
        <div className="sticky top-24">
          <div className="rounded-2xl shadow bg-gradient-to-br from-sky-50 via-white to-cyan-50 border border-sky-100 p-6">
            <h2 className="text-xl font-bold text-sky-700 mb-4 tracking-tight">카테고리</h2>
            {loadingCategories ? (
              <div className="text-gray-400 text-sm">카테고리를 불러오는 중...</div>
            ) : (
              <CategorySidebar
                categories={categories}
                onSelect={(id) => window.location.href = `/sale-posts?categoryId=${id}`}
              />
            )}
          </div>
        </div>
      </aside>
      <div className="flex-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((p) => (
            <Link
              key={p.salePostId}
              href={`/sale-posts/${p.salePostId}`}
              className="block bg-white rounded-2xl shadow-lg border border-sky-100 hover:shadow-xl transition-all p-4 cursor-pointer h-full"
            >
              {p.thumbnailUrl ? (
                <img
                  src={p.thumbnailUrl}
                  alt={p.title}
                  className="h-44 w-full object-cover mb-3 rounded-xl bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              ) : (
                <div className="h-44 w-full mb-3 rounded-xl bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">이미지 없음</span>
                </div>
              )}
              <h3 className="text-base font-bold mb-1 truncate text-sky-800">{p.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-cyan-600 font-extrabold text-lg">₩{p.price.toLocaleString()}</span>
                <span className="text-xs text-gray-500">{p.categoryName}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">{p.tradeAddress}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">{p.sellerNickname}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-semibold ${
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