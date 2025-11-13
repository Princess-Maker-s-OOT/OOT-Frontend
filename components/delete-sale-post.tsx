"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteSalePostSuccessResponse = {
  httpStatus: "OK";
  statusValue: number;
  success: true;
  code: "SALE_POST_DELETED";
  message: string;
  timestamp: string;
};

type DeleteSalePostErrorResponse = {
  httpStatus: "BAD_REQUEST";
  statusValue: number;
  success: false;
  code: "CANNOT_DELETE_RESERVED_POST";
  message: string;
  timestamp: string;
};

export default function DeleteSalePost({ id }: { id: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("정말로 이 판매글을 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sale-posts/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const json = await res.json();
      if (res.ok) {
        alert((json && json.message) || "삭제되었습니다.");
        // 이동: 목록 페이지
        router.push(`/sale-posts`);
      } else {
        alert((json && json.message) || "삭제에 실패했습니다.");
      }
    } catch (err: any) {
      alert(err?.message || "네트워크 오류");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleDelete} disabled={loading} className="ml-2 bg-red-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50">
      {loading ? "삭제중..." : "삭제"}
    </button>
  );
}
