
# 🌈 OOT (Outfit Of Today) – 의류 거래 & 디지털 옷장 플랫폼 | Frontend

Next.js 기반의 **의류 거래 + 디지털 옷장 관리** 웹 서비스입니다. 옷 등록, 판매, 기부, 실시간 채팅, 결제까지 한 번에!

<img width="1536" height="1024" alt="프로젝트 커버 이미지 최종" src="https://github.com/user-attachments/assets/e8814dd4-71b7-4945-a67b-77ba35f5a53b" />


---

## ✨ 주요 기능

### 🛍️ 거래
- 판매글 등록/수정/삭제
- 이미지 업로드 (S3 Presigned URL)
- 카테고리·가격 설정
- 실시간 채팅 (WebSocket + STOMP)
- 토스 페이먼츠 결제 연동

### 👕 디지털 옷장
- 옷 등록(사이즈/색상/카테고리)
- 공개/비공개 설정 (소셜 옷장)
- 착용 빈도 기반 통계 대시보드
- 카테고리별 분포 시각화

### 🎁 기부
- 카카오맵 기반 기부센터 검색
- 기부 내역 확인

### 👤 사용자
- 회원가입·로그인(JWT + OAuth2 Google)
- 프로필 수정
- 로그인 디바이스 관리
- 계정 보안 설정

---

## 🛠️ 기술 스택

**Frontend**
- Next.js 15.3.3 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts

**API & Infra**
- REST API + WebSocket(STOMP)
- JWT 인증
- Kakao Maps API
- Toss Payments
- AWS S3 이미지 업로드

---

## 📂 프로젝트 구조

```text
oot/
├── app/                      # Next.js App Router Pages
│   ├── admin/               # 관리자 페이지
│   ├── auth/                # Google OAuth Callback 등
│   ├── chat/                # 채팅 기능
│   ├── closets/             # 옷장 관리
│   ├── clothes/             # 옷 관리
│   ├── donation-centers/    # 기부센터 검색
│   ├── my/                  # 마이페이지
│   ├── payment/             # 결제
│   ├── sale-posts/          # 판매글 목록/등록/상세
│   └── signup/              # 회원가입
│
├── components/
│   ├── my/                  # 마이페이지 UI
│   ├── sale-post/           # 판매글 UI
│   └── ui/                  # 공통 UI(shadcn)
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-toast.ts
│   └── useWebSocket.ts
│
├── lib/
│   ├── api/                 # API Client
│   ├── types/               # TypeScript 타입 정의
│   └── utils/               # Utilities
│
└── public/                  # Static Assets
```

---

## 🚀 시작하기

### 요구 사항
- Node.js 18+
- pnpm (권장) 또는 npm
- Backend 서버 (http://localhost:8080)

### 설치

```bash
pnpm install
```

### 환경 변수 설정

`.env.local` 파일을 생성하여 아래 내용 입력:

```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_KAKAO_MAPS_APP_KEY="your-kakao-key"
NEXT_PUBLIC_TOSS_CLIENT_KEY="your-toss-client-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 개발 서버 실행

```bash
pnpm dev
# http://localhost:3000 접속
```

### 프로덕션 빌드

```bash
pnpm build
pnpm start
```

---

## 🔧 API 프록시 설정 (Next.js rewrites)

`next.config.mjs`에서 CORS 문제 해결을 위해 rewrites 사용:

```js
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://localhost:8080/api/v1/:path*',
    },
  ]
}
```
프론트엔드는 항상 `/api/v1/...` 형식으로 호출하면 됩니다.

---

## 📱 주요 페이지

| 경로                    | 설명             |
|-------------------------|------------------|
| `/`                     | 메인             |
| `/login`                | 로그인           |
| `/signup`               | 회원가입         |
| `/sale-posts`           | 판매글 목록      |
| `/sale-posts/new`       | 판매글 등록      |
| `/closets`              | 공개 옷장 목록   |
| `/clothes/new`          | 옷 등록          |
| `/my`                   | 마이페이지       |
| `/chat`                 | 채팅 목록        |
| `/chat/[id]`            | 채팅 상세        |
| `/donation-centers/search` | 기부센터 검색 |

---

## 🔐 인증 방식

- JWT 기반 로그인/인증
- AccessToken / RefreshToken → localStorage 저장
- 401 응답 시 자동 로그아웃 처리
- Google OAuth2 로그인 지원

---

## 🎨 UX/UI Features

- 완전 반응형 UI
- shadcn/ui 기반 디자인 시스템
- Skeleton 로딩
- Toast 알림 시스템
- Recharts 데이터 시각화

---

## 🧪 주요 컴포넌트

- **useAuth**: 로그인 상태 관리, 토큰 업데이트 & 사용자 정보 동기화
- **apiClient**: Authorization 헤더 자동 추가, API 에러 공통 처리
- **useWebSocket**: STOMP + SockJS 연결 및 채팅 이벤트 관리
- **MyDashboard**: 카테고리/착용 빈도 그래프 시각화

---

## ⚠️ 알려진 제한사항

- Google OAuth는 localhost 기반으로 기본 설정됨
- 이미지 업로드 → AWS S3 Presigned URL 방식
- WebSocket → STOMP + SockJS 사용

---

## 📄 License

MIT License
