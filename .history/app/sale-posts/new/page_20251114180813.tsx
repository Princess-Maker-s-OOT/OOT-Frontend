"use client";

import React, { useEffect, useState } from "react";
import { CreateSalePostSchema, CreateSalePostRequest } from "@/lib/validation";
import CategorySelector from "@/components/CategorySelector";
import { getCategories, type CategoryResponse } from "@/lib/api/categories";
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image";
import { apiPost } from "@/lib/api/client";

type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

export default function NewSalePostPage() {
  const [form, setForm] = useState<CreateSalePostRequest>({
    title: "",
    content: "",
    price: 0,
    categoryId: 0, // 초기값 0으로 설정, 카테고리 로드 후 첫 번째 카테고리로 변경
    tradeAddress: "",
    tradeLatitude: "37.5665", // 기본값: 서울시청 위도
    tradeLongitude: "126.9780", // 기본값: 서울시청 경도
    imageUrls: [],
  });
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 카테고리 목록 로드
  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoadingCategories(true)
      const result = await getCategories(0, 100)
      
      if (result.success && result.data) {
        // 백엔드에서 받은 flat 카테고리를 트리 구조로 변환
        const flatCategories = result.data.content
        const categoryMap = new Map<number, CategoryNode>()
        const rootCategories: CategoryNode[] = []

        // 먼저 모든 카테고리를 Map에 저장
        flatCategories.forEach((cat: CategoryResponse) => {
          categoryMap.set(cat.id, {
            id: cat.id,
            name: cat.name,
            children: []
          })
        })

        // 트리 구조 구성 (백엔드에 parentId 정보가 있다면)
        // 현재는 flat 구조이므로 그대로 사용
        flatCategories.forEach((cat: CategoryResponse) => {
          const node = categoryMap.get(cat.id)!
          rootCategories.push(node)
        })

        setCategories(rootCategories)
        
        // 첫 번째 카테고리를 기본값으로 설정
        if (rootCategories.length > 0 && form.categoryId === 0) {
          setForm(prev => ({ ...prev, categoryId: rootCategories[0].id }))
        }
      }
    } catch (err) {
      console.error("카테고리 로드 실패:", err)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);

    if (form.imageUrls.length === 0) {
      setErrors("이미지를 최소 1개 이상 등록해주세요.");
      return;
    }

    const parsed = CreateSalePostSchema.safeParse({
      ...form,
      price: Number(form.price),
    });

    if (!parsed.success) {
      setErrors(parsed.error.errors.map((i) => i.message).join(", "));
      return;
    }

    console.log("판매글 작성 요청 데이터:", parsed.data);

    setLoading(true);
    try {
      const result = await apiPost("/api/v1/sale-posts", parsed.data);
      
      console.log("판매글 작성 응답:", result);
      
      if (result.success) {
        setSuccess("판매글이 등록되었습니다.");
        // 2초 후 판매글 목록으로 이동
        setTimeout(() => {
          window.location.href = "/sale-posts";
        }, 2000);
      } else {
        setErrors(result.message || "등록 실패");
      }
    } catch (err: any) {
      console.error("판매글 작성 에러:", err);
      setErrors(err?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  function addImage() {
    if (!imageInput) return;
    setForm((s) => ({ ...s, imageUrls: [...s.imageUrls, imageInput] }));
    setImageInput("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErrors("로그인이 필요합니다.");
      return;
    }

    setUploadingImage(true);
    setErrors(null);

    try {
      // 1. Presigned URL 생성
      const presigned = await createPresignedUrl({
        fileName: file.name,
        type: "salepost"
      });

      if (!presigned.success || !presigned.data) {
        setErrors(presigned.message || "이미지 업로드 URL 생성 실패");
        return;
      }

      const { presignedUrl, fileUrl, s3Key } = presigned.data;

      // 2. S3에 업로드
      const uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        setErrors("이미지 업로드 실패");
        return;
      }

      // 3. 이미지 메타데이터 저장
      const saveResult = await saveImageMetadata({
        fileName: file.name,
        url: fileUrl,
        s3Key: s3Key,
        contentType: file.type,
        type: "SALEPOST",
        size: file.size
      });

      if (!saveResult.success) {
        console.warn("이미지 메타데이터 저장 실패:", saveResult.message);
      }

      // 4. 성공 시 imageUrls에 추가
      setForm((s) => ({ ...s, imageUrls: [...s.imageUrls, fileUrl] }));
    } catch (err: any) {
      setErrors(err?.message || "이미지 업로드 중 오류 발생");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    setForm((s) => ({
      ...s,
      imageUrls: s.imageUrls.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* 상단 안내 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-sky-600">판매글 등록</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          판매하고 싶은 의류 상품을 등록해주세요.<br />
          사진과 정보를 자세히 입력할수록 거래 성공률이 높아집니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">제목 <span className="text-red-500">*</span></label>
          <input
            className="w-full border rounded px-3 py-2"
            maxLength={100}
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">최대 100자까지 입력 가능합니다.</p>
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">내용 <span className="text-red-500">*</span></label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={6}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">내용을 입력해주세요.</p>
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-medium mb-1">가격 <span className="text-red-500">*</span></label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            min={0}
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <p className="text-xs text-gray-500 mt-1">0원 이상 입력해주세요.</p>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium mb-1">카테고리 <span className="text-red-500">*</span></label>
          {loadingCategories ? (
            <p className="text-sm text-gray-400">카테고리를 불러오는 중...</p>
          ) : (
            <CategorySelector
              categories={categories}
              onSelect={(id) => setForm({ ...form, categoryId: id })}
            />
          )}
        </div>

        {/* 거래 위치 */}
        <div>
          <label className="block text-sm font-medium mb-1">거래 위치 <span className="text-red-500">*</span></label>
          <input
            className="w-full border rounded px-3 py-2"
            required
            value={form.tradeAddress}
            onChange={(e) => setForm({ ...form, tradeAddress: e.target.value })}
          />
        </div>

        {/* 이미지 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            이미지 <span className="text-red-500">*</span>
          </label>
          
          {/* 파일 업로드 버튼 */}
          <div className="mb-3">
            <label className="cursor-pointer inline-block px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 disabled:opacity-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              {uploadingImage ? "업로드 중..." : "이미지 선택"}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              이미지 파일을 선택하면 자동으로 업로드됩니다.
            </p>
          </div>

          {/* URL 직접 입력 (선택사항) */}
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border rounded px-3 py-2"
              placeholder="또는 이미지 URL을 직접 입력"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              추가
            </button>
          </div>

          {/* 업로드된 이미지 목록 */}
          <div className="mt-2 space-y-2">
            {form.imageUrls.map((url, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <img src={url} alt={`이미지 ${i + 1}`} className="w-16 h-16 object-cover rounded" />
                <span className="text-xs text-gray-600 flex-1 truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="text-red-500 text-xs hover:underline"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>

          {form.imageUrls.length === 0 && (
            <p className="text-xs text-red-500 mt-1">이미지를 최소 1개 이상 등록해주세요.</p>
          )}
        </div>

        {/* 메시지 */}
        {errors && <div className="text-sm text-red-600">{errors}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        {/* 버튼 */}
        <div className="flex justify-between mt-6">
          <button type="button" className="bg-gray-300 text-black px-4 py-2 rounded">
            임시 저장
          </button>
          <button type="submit" disabled={loading} className="bg-sky-100 text-sky-700 px-4 py-2 rounded disabled:opacity-50">
            {loading ? "작성 중..." : "작성 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}