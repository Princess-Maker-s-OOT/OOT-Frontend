import React from "react";
import DeleteSalePost from '@/components/delete-sale-post';
import { getMockSalePostById } from '@/lib/mockData';
import BuilderBanner from '@/components/builder-banner';
import { builder } from '@builder.io/sdk';
import type { BuilderContent } from '@builder.io/react';
import MarketplaceHeader from '@/components/marketplace-header';
import MarketplaceFooter from '@/components/marketplace-footer';
import Link from "next/link";
import PurchaseButton from '@/components/sale-post/PurchaseButton';
import ChatButton from '@/components/sale-post/ChatButton';


// Builder.io 설정 상수

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;
const BUILDER_MODEL_NAME = 'announcement-banner';

type SalePostDetailResponse = {
    httpStatus: "OK";
    statusValue: 200;
    success: true;
    code: string;
    message: string;
    timestamp: string;
    data: {
        salePostId: number;
        title: string;
        content: string;
        price: number;
        status: "AVAILABLE" | "SOLD";
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
};

async function fetchSalePostDetail(id: number) {
    const res = await fetch(`/api/v1/sale-posts/${id}`);
    const json = await res.json();
    return json as SalePostDetailResponse;
}

async function fetchBuilderContent(id: number): Promise<BuilderContent | null> {
    if (!BUILDER_API_KEY) return null;
    builder.init(BUILDER_API_KEY);
    const content = await builder.get(BUILDER_MODEL_NAME, {
        userAttributes: { urlPath: `/sale-posts/${id}` },
        options: {
            cache: 'force-cache',
            staleWhileRevalidate: 3600,
        },
    }).toPromise();
    return content ?? null;
}

export default async function SalePostDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    const resolvedParams = await params as { id: string };
    const id = Number(resolvedParams.id);

    const [builderContent, salePostData] = await Promise.all([
        fetchBuilderContent(id),
        fetchSalePostDetail(id).catch(() => null),
    ]);

    let data = salePostData;
    if (!data || !data.data) {
        const mock = getMockSalePostById(id);
        if (!mock) {
            return <div className="p-6">판매글을 찾을 수 없습니다.</div>;
        }
        data = {
            httpStatus: "OK",
            statusValue: 200,
            success: true,
            code: "SALE_POST_RETRIEVED",
            message: "mock",
            timestamp: new Date().toISOString(),
            data: {
                salePostId: mock.salePostId,
                title: mock.title,
                content: mock.content,
                price: mock.price,
                status: mock.status === "SOLD" ? "SOLD" : "AVAILABLE",
                tradeAddress: mock.tradeAddress,
                tradeLatitude: mock.tradeLatitude,
                tradeLongitude: mock.tradeLongitude,
                sellerId: mock.sellerId,
                sellerNickname: mock.sellerNickname,
                categoryName: mock.categoryName,
                imageUrls: mock.imageUrls,
                createdAt: mock.createdAt,
                updatedAt: mock.updatedAt,
            },
        };
    }

    const d = data.data;

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