"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeleteSalePost from '@/components/delete-sale-post';
import BuilderBanner from '@/components/builder-banner';
import MarketplaceHeader from '@/components/marketplace-header';
import MarketplaceFooter from '@/components/marketplace-footer';
import Link from "next/link";
import PurchaseButton from '@/components/sale-post/PurchaseButton';
import ChatButton from '@/components/sale-post/ChatButton';
import { apiGet } from "@/lib/api/client";

type SalePostDetail = {
  salePostId: number;
  title: string;
  content: string;
  price: number;
  status: "SELLING" | "RESERVED" | "SOLD_OUT";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerId: number;
  sellerNickname: string;
  categoryName: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export default function SalePostDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  
  const [post, setPost] = useState<SalePostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPost();
  }, [id]);

  async function loadPost() {
    try {
      setLoading(true);
      const result = await apiGet<SalePostDetail>(
        `/api/v1/sale-posts/${id}`,
        { requiresAuth: false }
      );

      if (result.success && result.data) {
        setPost(result.data);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "판매글을 찾을 수 없습니다."}</p>
          <Link href="/sale-posts" className="text-sky-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Builder.io 배너 */}
            <div className="mx-auto px-4 md:px-6 lg:px-8 w-full max-w-5xl">
                <BuilderBanner content={builderContent} />
            </div>

            {/* 상품 정보 영역 */}
            <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div className="flex flex-col items-center justify-center border rounded p-4 bg-gray-50">
                    {d.imageUrls.length > 0 ? (
                        <img
                            src={d.imageUrls[0]}
                            alt="상품 이미지"
                            className="w-full h-80 object-cover rounded"
                        />
                    ) : (
                        <div className="h-80 w-full flex items-center justify-center text-gray-400">
                            상품 이미지
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-500">제목</label>
                        <p className="text-lg font-semibold">{d.title}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">가격</label>
                        <p className="text-lg text-sky-600 font-bold">₩{d.price.toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">상품설명</label>
                        <p className="text-sm text-gray-700">{d.content}</p>
                    </div>
                </div>
            </main>

            <div className="flex justify-center gap-4 py-6">
                <ChatButton salePostId={d.salePostId} />
                <PurchaseButton
                    salePostId={d.salePostId}
                    title={d.title}
                    price={d.price}
                    sellerId={d.sellerId}
                    status={d.status}
                />
            </div>

        </div>
    );
}