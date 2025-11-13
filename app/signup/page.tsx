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
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);

    const parsed = SignupSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.errors.map((i) => i.message).join(", "));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        setSuccess((json && json.message) || "회원가입이 완료되었습니다.");
      } else {
        setErrors((json && json.message) || "회원가입에 실패했습니다.");
      }
    } catch (err: any) {
      setErrors(err?.message || "네트워크 오류");
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
          <input className="w-full border rounded px-3 py-2" value={form.loginId} onChange={(e) => setForm({ ...form, loginId: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nickname</label>
            <input className="w-full border rounded px-3 py-2" value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input className="w-full border rounded px-3 py-2" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <p className="text-xs text-gray-400 mt-1">최소 8자, 대문자 1개, 숫자 1개 포함</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone (010XXXXXXXX)</label>
          <input className="w-full border rounded px-3 py-2" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
        </div>

        {errors && <div className="text-sm text-red-600">{errors}</div>}
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
