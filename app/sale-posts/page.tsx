import React from "react";
import { getMockSalePosts } from "@/lib/mock/sale"; // ✅ 경로 수정

type SalePostSummary = {
  salePostId: number;
  title: string;
  price: number;
  status: "AVAILABLE" | "SOLD";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerNickname: string;
  categoryName: string;
  createdAt: string;
  imageUrl: string;
};

type SalePostListResponse = {
  httpStatus: "OK";
  statusValue: number;
  success: true;
  code: string;
  message: string;
  timestamp: string;
  data: {
    content: SalePostSummary[];
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  };
};

async function fetchSalePostList(params?: { page?: number; size?: number }) {
  try {
    const q = new URLSearchParams({
      page: ((params?.page) ?? 0).toString(),
      size: ((params?.size) ?? 10).toString(),
    });
    const res = await fetch(`/api/v1/sale-posts?${q.toString()}`);
    if (!res.ok) throw new Error("api error");
    const json = await res.json();
    return json as SalePostListResponse;
  } catch (e) {
    const mocks = getMockSalePosts();
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "SALE_POSTS_RETRIEVED",
      message: "mock",
      timestamp: new Date().toISOString(),
      data: {
        content: mocks.map((m) => ({
          salePostId: m.salePostId,
          title: m.title,
          price: m.price,
          status: m.status === "SOLD" ? "SOLD" : "AVAILABLE",
          tradeAddress: m.tradeAddress,
          tradeLatitude: m.tradeLatitude,
          tradeLongitude: m.tradeLongitude,
          sellerNickname: m.sellerNickname,
          categoryName: m.categoryName,
          createdAt: m.createdAt,
          imageUrl: m.imageUrls?.[0] ?? "",
        })),
        size: mocks.length,
        number: 0,
        first: true,
        last: true,
        numberOfElements: mocks.length,
        empty: mocks.length === 0,
      },
    } as SalePostListResponse;
  }
}

export default async function SalePostsPage() {
  const data = await fetchSalePostList({ page: 0, size: 12 }).catch(() => null);
  const posts = data?.data?.content ?? [];

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