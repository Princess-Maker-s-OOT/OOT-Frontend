"use client";

import React, { useEffect, useState } from "react";
import { CreateSalePostSchema, CreateSalePostRequest } from "@/lib/validation";
import CategorySelector from "@/components/CategorySelector";
import { getCategories, buildCategoryTree, type CategoryNode } from "@/lib/api/categories";
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image";
import Image from "next/image";
import { apiPost } from "@/lib/api/client";
import { Loader2 } from "lucide-react";
import { Upload, X } from "lucide-react";

export default function NewSalePostPage() {
  // form state 선언을 최상단에 위치
  const [form, setForm] = useState<CreateSalePostRequest>({
    title: "",
    content: "",
    price: 0,
    categoryId: 0,
    tradeAddress: "",
    tradeLatitude: "37.5665",
    tradeLongitude: "126.9780",
    imageUrls: [],
  });
  const [previewImages, setPreviewImages] = useState<{ id: number; url: string }[]>([]);
  const [addressSearch, setAddressSearch] = useState("");
  const [searchingAddress, setSearchingAddress] = useState(false);

  // 지도 렌더링 (주소 좌표 변경 시)
  useEffect(() => {
    if (form.tradeLatitude && form.tradeLongitude && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;
        const options = {
          center: new window.kakao.maps.LatLng(form.tradeLatitude, form.tradeLongitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(form.tradeLatitude, form.tradeLongitude),
        });
        marker.setMap(map);
      });
    }
  }, [form.tradeLatitude, form.tradeLongitude]);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  async function searchAddress() {
    if (!addressSearch.trim()) return;
    setSearchingAddress(true);
    if (!window.kakao || !window.kakao.maps) {
      setSearchingAddress(false);
      return;
    }
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(addressSearch, (result: any, status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          const { address_name, y, x } = result[0];
          setForm((prev) => ({
            ...prev,
            tradeAddress: address_name,
            tradeLatitude: y,
            tradeLongitude: x,
          }));
        }
        setSearchingAddress(false);
      });
    });
  }
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
      const result = await getCategories(0, 200)
      
      if (result.success && result.data) {
        const tree = buildCategoryTree(result.data.content)
        setCategories(tree)
        
        // 첫 번째 최상위 카테고리를 기본값으로 설정
        if (tree.length > 0 && form.categoryId === 0) {
          setForm(prev => ({ ...prev, categoryId: tree[0].id }))
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

    if (!form.categoryId || form.categoryId === 0) {
      setErrors("카테고리를 선택해주세요.");
      return;
    }

    const parsed = CreateSalePostSchema.safeParse({
      ...form,
      price: form.price,
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
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setErrors(null);
    const newImageUrls: string[] = [];
    const newPreviews: { url: string }[] = [];
    try {
      for (const file of Array.from(files)) {
        const presigned = await createPresignedUrl({
          fileName: file.name,
          type: "salepost"
        });
        if (!presigned.success || !presigned.data) {
          throw new Error(presigned.message || "이미지 업로드 URL 생성 실패");
        }
        const { presignedUrl, fileUrl, s3Key } = presigned.data as unknown as import("@/lib/types/image").CreatePresignedUrlSuccessResponse["data"];
        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!uploadRes.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const saveResult = await saveImageMetadata({
          fileName: file.name,
          url: fileUrl,
          s3Key: s3Key,
          contentType: file.type,
          type: "SALEPOST",
          size: file.size
        });
        if (saveResult.success && saveResult.data) {
          const imageData = saveResult.data as unknown as import("@/lib/types/image").SaveImageMetadataSuccessResponse["data"];
          newImageUrls.push(imageData.url);
          newPreviews.push({ id: Date.now(), url: imageData.url });
        }
      }
      setForm((s) => ({ ...s, imageUrls: [...s.imageUrls, ...newImageUrls] }));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    } catch (err: any) {
      setErrors(err?.message || "이미지 업로드 중 오류 발생");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function removeImage(imageId: number) {
    setForm((s) => ({
      ...s,
      imageUrls: s.imageUrls.filter((url) => url !== previewImages.find((img) => img.id === imageId)?.url),
    }));
    setPreviewImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* 상단 안내 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-sky-600">판매글 등록</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          판매하고 싶은 의류 상품을 등록해주세요.<br />
          사진과 정보를 자세히 입력할수록 거래 성공률이 높아집니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded shadow">
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
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border rounded px-3 py-2"
            placeholder="가격을 입력하세요 (예: 15000)"
            required
            value={form.price}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '')
              setForm({ ...form, price: value as any })
            }}
          />
          <p className="text-xs text-gray-500 mt-1">숫자만 입력 가능합니다.</p>
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
          <div className="flex gap-2">
            <input
              className="w-full border rounded px-3 py-2"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              placeholder="주소 검색 (예: 서울시 강남구 역삼동)"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  searchAddress();
                }
              }}
            />
            <button
              type="button"
              onClick={searchAddress}
              disabled={searchingAddress}
              className="bg-sky-500 text-white px-4 py-2 rounded"
            >
              {searchingAddress ? <Loader2 className="h-4 w-4 animate-spin" /> : "검색"}
            </button>
          </div>
          {form.tradeAddress && (
            <div className="p-2 mt-2 bg-sky-50 rounded border border-sky-200">
              <div className="text-sm font-medium text-sky-900">{form.tradeAddress}</div>
              {/* 위도/경도 텍스트 숨김 처리 */}
              <div id="map" className="w-full h-64 mt-2 rounded border" />
            </div>
          )}
        </div>

        {/* 이미지 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium mb-1">이미지 <span className="text-red-500">*</span></label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-sky-400 transition-colors">
            <input
              type="file"
              id="sale-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            <label
              htmlFor="sale-images"
              className="flex flex-col items-center justify-center cursor-pointer py-4"
            >
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {uploadingImage ? "업로드 중..." : "클릭하여 이미지 업로드"}
              </p>
              <p className="text-xs text-gray-500">여러 장 선택 가능</p>
            </label>
          </div>
          {/* 이미지 미리보기 */}
          {previewImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {previewImages.map((img, index) => (
                <div key={img.id ?? index} className="relative aspect-square">
                  <Image
                    src={img.url}
                    alt="업로드된 이미지"
                    fill
                    className="object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute top-1 left-1 bg-sky-500 text-white text-xs px-2 py-1 rounded">
                      메인
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {previewImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">* 첫 번째 이미지가 썸네일로 사용됩니다.</p>
          )}
          {previewImages.length === 0 && (
            <p className="text-xs text-red-500 mt-1">이미지를 최소 1개 이상 등록해주세요.</p>
          )}
        </div>

        {/* 메시지 */}
        {errors && <div className="text-sm text-red-600">{errors}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        {/* 버튼 */}
        <div className="flex gap-3 pt-4">
          <button type="button" className="flex-1 bg-gray-100 text-gray-700 py-4 text-lg font-bold rounded-lg">
            임시 저장
          </button>
          <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-500 hover:to-cyan-500 text-white py-4 text-lg font-bold rounded-lg">
            {loading ? "작성 중..." : "작성 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}