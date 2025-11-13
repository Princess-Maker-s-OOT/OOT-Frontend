"use client";

import { builder } from "@builder.io/sdk";

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY!;

// Builder 초기화 상태를 추적 (중복 초기화 방지용)
let initialized = false;

export default function BuilderInitializer() {
  if (BUILDER_API_KEY && !initialized) {
    builder.init(BUILDER_API_KEY);
    initialized = true;
  }

  // 초기화 전용 컴포넌트이므로 아무것도 렌더링하지 않음
  return null;
}
