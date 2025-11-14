"use client";

import React, { useState } from "react";
import { SignupSchema, SignupRequest } from "@/lib/validation";

export default function SignupPage() {
  const [form, setForm] = useState<SignupRequest>({
    loginId: "",
    email: "",
    nickname: "",
    username: "",
    password: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSuccess(null);

    const parsed = SignupSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const res = await fetch(`${apiUrl}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSuccess(json.message || "회원가입이 완료되었습니다.");
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        setErrors({ _form: json.message || "회원가입에 실패했습니다." });
      }
    } catch (err: any) {
      setErrors({ _form: err?.message || "네트워크 오류" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">회원가입</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-1">Login ID</label>
          <input 
            className={`w-full border rounded px-3 py-2 ${errors.loginId ? 'border-red-500' : ''}`}
            value={form.loginId} 
            onChange={(e) => setForm({ ...form, loginId: e.target.value })} 
          />
          {errors.loginId && <p className="text-xs text-red-600 mt-1">{errors.loginId}</p>}
          <p className="text-xs text-gray-400 mt-1">4~15자</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email"
            className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <input 
              className={`w-full border rounded px-3 py-2 ${errors.nickname ? 'border-red-500' : ''}`}
              value={form.nickname} 
              onChange={(e) => setForm({ ...form, nickname: e.target.value })} 
            />
            {errors.nickname && <p className="text-xs text-red-600 mt-1">{errors.nickname}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              className={`w-full border rounded px-3 py-2 ${errors.username ? 'border-red-500' : ''}`}
              value={form.username} 
              onChange={(e) => setForm({ ...form, username: e.target.value })} 
            />
            {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : ''}`}
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-400 mt-1">최소 8자, 대문자 1개, 숫자 1개 포함</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input 
            className={`w-full border rounded px-3 py-2 ${errors.phoneNumber ? 'border-red-500' : ''}`}
            value={form.phoneNumber} 
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} 
            placeholder="01012345678"
          />
          {errors.phoneNumber && <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>}
          <p className="text-xs text-gray-400 mt-1">010XXXXXXXX 형식 (하이픈 제외)</p>
        </div>

        {errors._form && <div className="text-sm text-red-600 p-3 bg-red-50 rounded">{errors._form}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        <div className="flex justify-end">
          <button disabled={loading} className="bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? "전송중..." : "회원가입"}
          </button>
        </div>
      </form>
    </div>
  );
}
