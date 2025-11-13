"use client";

import { BuilderContent } from "@builder.io/react";
import React from "react";

const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY;

interface BuilderBannerProps {
  content?: BuilderContent | null;
}

/**
 * BuilderBanner 컴포넌트는 Builder.io에서 'announcement-banner' 모델로 생성된 콘텐츠를 표시합니다.
 * 이 컴포넌트는 SSR 또는 SSG를 위해 설계되어 런타임 API 호출을 최소화합니다.
 */
export default function BuilderBanner({ content }: BuilderBannerProps) {
  if (!content) {
    // 콘텐츠가 없을 때는 중복 배너 표시를 막기 위해 아무것도 렌더링하지 않습니다.
    // Builder.io에서 직접 배너를 관리하므로 로컬 폴백은 제거합니다.
    return null;
  }

  // BuilderContent를 사용하여 가져온 데이터를 렌더링합니다.
  return (
    <div className="my-6 w-full">
      {/* BuilderContent props 타입이 현재 프로젝트의 타입과 완전히 일치하지 않아
          타입 검사에서 무시합니다. (런타임에는 정상 동작합니다) */}
      {/* @ts-ignore */}
      <BuilderContent
        content={content as any}
        model="announcement-banner"
      />
    </div>
  );
}
