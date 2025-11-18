"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DeleteSalePost from '@/components/delete-sale-post';
import BuilderBanner from '@/components/builder-banner';
import MarketplaceHeader from '@/components/marketplace-header';
import MarketplaceFooter from '@/components/marketplace-footer';
import Link from "next/link";
import PurchaseButton from '@/components/sale-post/PurchaseButton';
import ChatButton from '@/components/sale-post/ChatButton';
import { apiGet, apiDelete } from "@/lib/api/client";

type SalePostImage = {
  imageId: number;
  imageUrl: string;
  displayOrder: number;
  isMain: boolean;
};

type SalePostDetail = {
  salePostId: number;
  title: string;
  content: string;
  price: number;
  status: "AVAILABLE" | "SELLING" | "RESERVED" | "SOLD_OUT";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerId: number;
  sellerNickname: string;
  sellerImageUrl?: string;
  categoryName: string;
  images: SalePostImage[];
  createdAt: string;
  updatedAt: string;
};

export default function SalePostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [post, setPost] = useState<SalePostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserNickname, setCurrentUserNickname] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadPost();

    // 현재 로그인한 사용자 정보 가져오기
    const userInfoStr = localStorage.getItem("userInfo");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // 닉네임으로 본인 글인지 확인
        setCurrentUserNickname(userInfo.nickname || null);
      } catch (e) {
        console.error("userInfo 파싱 실패:", e);
      }
    }
  }, [id]);

  async function loadPost() {
    try {
      setLoading(true);
      const result = await apiGet<SalePostDetail>(
        `/api/v1/sale-posts/${id}`,
        { requiresAuth: false }
      );

      console.log("=== 판매글 상세 조회 응답 ===");
      console.log("결과:", result);
      console.log("전체 data:", JSON.stringify(result.data, null, 2));
      console.log("이미지 URLs:", result.data?.imageUrls);

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

  async function handleDelete() {
    if (!confirm("정말로 이 판매글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await apiDelete(`/api/v1/sale-posts/${id}`);
      if (result.success) {
        alert("판매글이 삭제되었습니다.");
        router.push("/sale-posts");
      } else {
        alert(result.message || "삭제에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("삭제 실패:", err);
      alert(err?.message || "삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  const isOwner = currentUserNickname !== null && post?.sellerNickname === currentUserNickname;

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
      {/* 상품 정보 영역 */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="flex flex-col items-center justify-center border rounded p-4 bg-gray-50">
          {post.images && post.images.length > 0 ? (
            <img
              src={post.images[0].imageUrl}
              alt="상품 이미지"
              className="w-full h-80 object-cover rounded"
              onError={(e) => {
                console.error("이미지 로드 실패:", post.images[0].imageUrl);
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="h-80 w-full flex items-center justify-center text-gray-400 bg-gray-200 rounded">이미지를 불러올 수 없습니다</div>';
                }
              }}
              onLoad={() => {
                console.log("이미지 로드 성공:", post.images[0].imageUrl);
              }}
            />
          ) : (
            <div className="h-80 w-full flex items-center justify-center text-gray-400 bg-gray-200 rounded">
              이미지 없음
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500">카테고리</label>
            <p className="text-sm text-gray-600">{post.categoryName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">제목</label>
            <p className="text-lg font-semibold">{post.title}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">가격</label>
            <p className="text-lg text-sky-600 font-bold">₩{post.price.toLocaleString()}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">판매 상태</label>
            <p className={`text-sm font-medium ${
              (post.status === "SELLING" || post.status === "AVAILABLE")
                ? "text-green-600" 
                : post.status === "RESERVED"
                ? "text-yellow-600"
                : "text-gray-600"
            }`}>
              {(post.status === "SELLING" || post.status === "AVAILABLE") ? "판매중" : post.status === "RESERVED" ? "예약중" : "판매완료"}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-500">판매자</label>
            <p className="text-sm text-gray-700">{post.sellerNickname}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">거래 위치</label>
            <p className="text-sm text-gray-700">{post.tradeAddress}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">상품설명</label>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </main>

      <div className="flex justify-center gap-4 py-6">
        {isOwner ? (
          <>
            <Link
              href={`/sale-posts/${post.salePostId}/edit`}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition"
            >
              수정하기
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
            >
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </button>
          </>
        ) : (
          <>
            <ChatButton salePostId={post.salePostId} />
            <PurchaseButton
              salePostId={post.salePostId}
              title={post.title}
              price={post.price}
              sellerId={post.sellerId}
              status={(post.status === "SELLING" || post.status === "AVAILABLE") ? "AVAILABLE" : post.status === "RESERVED" ? "RESERVED" : "SOLD"}
            />
          </>
        )}
      </div>
    </div>
  );
}