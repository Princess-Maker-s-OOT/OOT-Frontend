"use client"

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPresignedUrl, saveImageMetadata } from "@/lib/api/image";
import { useParams, useRouter } from "next/navigation";
import CategorySelector from "@/components/CategorySelector";
import { getCategories, buildCategoryTree } from "@/lib/api/categories";
import { UpdateSalePostSchema } from "@/lib/validation";
import type { UpdateSalePostRequest } from "@/lib/types";
import { Loader2 } from "lucide-react";

type CategoryNode = {
  id: number
  name: string
  children?: CategoryNode[]
}

export default function EditSalePostPage() {
  const { id } = useParams()
  const salePostId = Array.isArray(id) ? id[0] : id
  const router = useRouter()

  const [form, setForm] = useState<UpdateSalePostRequest & { status?: string }>({
    title: "",
    content: "",
    price: 0,
    categoryId: 0,
    tradeAddress: "",
    tradeLatitude: "37.5665",
    tradeLongitude: "126.9780",
    imageUrls: [],
    status: "SALE" // 상태 필드 추가 (예시: SALE, SOLD)
  });
  const [previewImages, setPreviewImages] = useState<{ url: string }[]>([]);
  const [addressSearch, setAddressSearch] = useState("");
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 카테고리 로딩
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const result = await getCategories(0, 200);
        if (result.success && result.data) {
          const tree = buildCategoryTree(result.data.content);
          setCategories(tree);
          if (tree.length > 0 && form.categoryId === 0) {
            setForm((prev) => ({ ...prev, categoryId: tree[0].id }));
          }
        }
      } catch (err) {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // 판매글 데이터 불러오기
  useEffect(() => {
    if (!salePostId) return;
    async function fetchData() {
      try {
        const res = await fetch(`/api/v1/sale-posts/${salePostId}`);
        const json = await res.json();
        if (res.ok && json.data) {
          const d = json.data;
          setForm({
            title: d.title,
            content: d.content,
            price: d.price,
            categoryId: d.categoryId ?? 0,
            tradeAddress: d.tradeAddress,
            tradeLatitude: String(d.tradeLatitude ?? "37.5665"),
            tradeLongitude: String(d.tradeLongitude ?? "126.9780"),
            imageUrls: d.imageUrls ?? [],
            status: d.status ?? "SALE"
          });
          setPreviewImages((d.imageUrls ?? []).map((url: string) => ({ url })));
        } else {
          setError("판매글 데이터를 불러올 수 없습니다.");
        }
      } catch {
        setError("네트워크 오류가 발생했습니다.");
      }
    }
    fetchData();
  }, [salePostId]);
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

  async function searchAddress() {
    if (!addressSearch.trim()) return;
    setSearchingAddress(true);
    if (!window.kakao || !window.kakao.maps) {
      setSearchingAddress(false);
      return;
    }
    window.kakao.maps.load(() => {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(addressSearch, (result, status) => {
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

  // 수정 요청
  async function updateSalePost(id: string, data: UpdateSalePostRequest) {
    const response = await fetch(`/api/v1/sale-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return await response.json()
  }

  // 삭제 요청
  async function deleteSalePost(id: string) {
    const confirmed = window.confirm("정말 삭제하시겠습니까?")
    if (!confirmed) return
    try {
      const res = await fetch(`/api/v1/sale-posts/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/sale-posts/my")
      } else {
        setError("삭제에 실패했습니다.")
      }
    } catch {
      setError("삭제 중 오류가 발생했습니다.")
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    setError(null);
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
          newPreviews.push({ url: imageData.url });
        }
      }
      setForm((s) => ({ ...s, imageUrls: [...s.imageUrls, ...newImageUrls] }));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    } catch (err: any) {
      setError(err?.message || "이미지 업로드 중 오류 발생");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  }

  function removeImage(imageUrl: string) {
    setForm((s) => ({
      ...s,
      imageUrls: s.imageUrls.filter((url) => url !== imageUrl),
    }));
    setPreviewImages((prev) => prev.filter((img) => img.url !== imageUrl));
  }

  // 제출 핸들러
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (form.imageUrls.length === 0) {
      setError("이미지를 최소 1개 이상 등록해주세요.");
      return;
    }
    if (!form.categoryId || form.categoryId === 0) {
      setError("카테고리를 선택해주세요.");
      return;
    }
    const parsed = UpdateSalePostSchema.safeParse({
      ...form,
      price: form.price === "" ? undefined : Number(form.price),
    });
    if (!parsed.success) {
      setError(parsed.error.errors.map((i) => i.message).join(", "));
      return;
    }
    setLoading(true);
    try {
      const result = await updateSalePost(salePostId!, parsed.data);
      if (result.success) {
        router.push(`/sale-posts/${salePostId}`);
      } else {
        setError(result.message || "수정 실패");
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      {/* 상단 안내 */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-sky-600">판매글 수정</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          기존 판매글을 수정하거나 삭제할 수 있습니다.<br />
          정보가 정확할수록 거래 성공률이 높아집니다.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded shadow">
        {/* 제목 */}
        <div>
          <label className="block text-sm font-medium mb-1">제목</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="block text-sm font-medium mb-1">내용</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows={6}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        {/* 가격 */}
        <div>
          <label className="block text-sm font-medium mb-1">가격</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-medium mb-1">카테고리</label>
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
              id="edit-images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="hidden"
            />
            <label
              htmlFor="edit-images"
              className="flex flex-col items-center justify-center cursor-pointer py-4"
            >
              <span className="h-10 w-10 text-gray-400 mb-2">📷</span>
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
                <div key={img.url ?? index} className="relative aspect-square">
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
                    onClick={() => removeImage(img.url)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    삭제
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
                {/* 상태 변경 드롭다운 */}
                <div>
                  <label className="block text-sm font-medium mb-1">판매 상태</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="SALE">판매중</option>
                    <option value="SOLD">거래완료</option>
                  </select>
                </div>
        {/* 메시지 */}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        {/* 버튼 */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => deleteSalePost(salePostId!)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200"
          >
            삭제하기
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-sky-100 text-sky-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "수정 중..." : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  )
}