# OOT (Out Of Towner) - 의류 거래 플랫폼 프론트엔드

의류 거래 및 옷장 관리를 위한 Next.js 기반 웹 애플리케이션입니다.

## 📋 주요 기능

### 🛍️ 거래 기능
- **판매글 등록/수정/삭제**: 이미지 업로드, 카테고리 선택, 가격 설정
- **실시간 채팅**: WebSocket(STOMP) 기반 판매자-구매자 채팅
- **결제 시스템**: 토스 페이먼츠 연동

### 👕 옷장 관리
- **옷 등록**: 카테고리, 사이즈, 색상별 관리
- **옷장 공개/비공개**: 다른 사용자에게 옷장 공유
- **착용 통계 대시보드**: 착용 빈도, 카테고리별 분포 차트

### 👤 사용자 기능
- **로그인/회원가입**: 일반 로그인 및 Google OAuth2
- **프로필 관리**: 닉네임, 거래 주소, 프로필 이미지
- **디바이스 관리**: 로그인된 디바이스 확인

### 🎁 기부 기능
- **기부센터 검색**: 카카오맵 기반 위치 검색
- **기부 내역 관리**

## 🛠️ 기술 스택

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Maps**: Kakao Maps API
- **Payment**: Toss Payments
- **Real-time**: WebSocket (STOMP + SockJS)
- **Auth**: JWT + OAuth2

## 📁 프로젝트 구조

```
oot/
├── app/                    # Next.js App Router 페이지
│   ├── admin/             # 관리자 페이지
│   ├── auth/              # 인증 관련 (OAuth 콜백)
│   ├── chat/              # 채팅 기능
│   ├── closets/           # 옷장 관리
│   ├── clothes/           # 옷 관리
│   ├── donation-centers/  # 기부센터
│   ├── login/             # 로그인
│   ├── my/                # 마이페이지
│   ├── payment/           # 결제
│   ├── sale-posts/        # 판매글
│   └── signup/            # 회원가입
├── components/            # 재사용 가능한 컴포넌트
│   ├── my/               # 마이페이지 관련 컴포넌트
│   ├── sale-post/        # 판매글 관련 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
├── hooks/                 # 커스텀 훅
│   ├── use-auth.ts       # 인증 상태 관리
│   ├── use-toast.ts      # 토스트 알림
│   └── useWebSocket.ts   # WebSocket 연결
├── lib/                   # 유틸리티 및 API
│   ├── api/              # API 클라이언트 함수
│   ├── types/            # TypeScript 타입 정의
│   └── utils/            # 유틸리티 함수
└── public/               # 정적 파일
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- pnpm (권장) 또는 npm
- 백엔드 서버 실행 (localhost:8080)

### 설치

```bash
# 의존성 설치
pnpm install

# 또는
npm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수를 설정:

```env
# API URL
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"

# 카카오맵 API
NEXT_PUBLIC_KAKAO_MAPS_APP_KEY="your-kakao-app-key"

# 토스 페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY="your-toss-client-key"

# Google OAuth (백엔드용)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

```

### 개발 서버 실행

```bash
pnpm dev
# 또는
npm run dev
```

http://localhost:3000 에서 확인 가능

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 🔧 API 프록시 설정

Next.js rewrites를 통해 백엔드 API를 프록시합니다:

```javascript
// next.config.mjs
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8080/api/v1/:path*',
    },
  ]
}
```

이를 통해 CORS 문제를 해결하고, 프론트엔드에서는 상대 경로(`/api/v1/...`)로 API를 호출합니다.

## 📱 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 페이지 |
| `/login` | 로그인 |
| `/signup` | 회원가입 |
| `/sale-posts` | 판매글 목록 |
| `/sale-posts/new` | 판매글 등록 |
| `/sale-posts/[id]` | 판매글 상세 |
| `/closets` | 공개 옷장 목록 |
| `/clothes/new` | 옷 등록 |
| `/my` | 마이페이지 (프로필, 옷, 옷장, 대시보드) |
| `/chat` | 채팅방 목록 |
| `/chat/[id]` | 채팅 상세 |
| `/donation-centers/search` | 기부센터 검색 |

## 🔐 인증 방식

- **JWT 토큰**: `localStorage`에 `accessToken`, `refreshToken` 저장
- **사용자 정보**: `userInfo`에 닉네임, 이메일, 역할 등 저장
- **OAuth2**: Google 소셜 로그인 지원
- **토큰 갱신**: 401 에러 시 자동 리다이렉트

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일/데스크톱 지원
- **스카이 블루 테마**: 일관된 색상 시스템
- **로딩 스켈레톤**: 부드러운 로딩 경험
- **토스트 알림**: 사용자 피드백 제공
- **차트 시각화**: Recharts 기반 통계 표시

## 🧪 주요 컴포넌트

### `useAuth` 훅
로그인 상태 관리 및 localStorage 동기화

### `apiClient`
인증 헤더 자동 추가 및 에러 처리

### `MyDashboard`
착용 통계 및 옷 분포 시각화

### `PurchaseButton` / `ChatButton`
거래 및 채팅 기능 통합

## ⚠️ 알려진 제한사항

- Google OAuth는 localhost에서만 사용 가능 (IP 주소 미지원)
- 이미지 업로드는 S3 Presigned URL 방식
- WebSocket은 STOMP 프로토콜 사용

## 📄 라이선스

MIT License
