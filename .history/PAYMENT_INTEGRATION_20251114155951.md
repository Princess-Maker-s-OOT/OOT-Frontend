# 토스 페이먼츠 결제 통합 가이드

## 📋 개요

OOT 프로젝트의 판매글 구매 시스템은 **토스 페이먼츠(Toss Payments)**를 통한 안전한 결제 처리를 지원합니다.

### 주요 특징
- ✅ **에스크로 방식**: 구매자 결제 → 판매자 수락 → 구매자 확정 → 정산
- ✅ **다단계 트랜잭션**: PENDING_APPROVAL → APPROVED → CONFIRMED
- ✅ **환불 지원**: 판매자 수락 전 구매자 취소 가능
- ✅ **채팅 연동**: 거래 전 판매자와 채팅 필수

---

## 🔄 결제 흐름

### 1️⃣ 거래 요청 (구매자)

**Frontend**
```typescript
// components/sale-post/PurchaseButton.tsx
const tossOrderId = generateTossOrderId() // UUID 생성

const result = await requestTransaction({
  salePostId: 123,
  amount: 50000,
  method: PaymentMethod.EASY_PAY,
  tossOrderId: "550e8400-e29b-41d4-a716-446655440000"
})
```

**Backend API**
```http
POST /api/v1/transactions/request
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "salePostId": 123,
  "amount": 50000,
  "method": "EASY_PAY",
  "tossOrderId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**백엔드 검증**
- ✅ 채팅방 존재 확인
- ✅ 최소 1회 이상 대화 확인
- ✅ 본인 판매글 구매 방지
- ✅ 판매글 상태 확인 (AVAILABLE만 가능)

**결과**
- Transaction 엔티티 생성: `status = PENDING_APPROVAL`
- Payment 엔티티 생성: `status = PENDING`
- 응답: `{ transactionId, tossOrderId, price, status, ... }`

---

### 2️⃣ 토스 결제 위젯 (구매자)

**Frontend**
```typescript
// 토스 SDK 동적 로드
const { loadTossPayments } = await import("@tosspayments/payment-sdk")
const tossPayments = await loadTossPayments(clientKey)

await tossPayments.requestPayment("카드", {
  amount: 50000,
  orderId: tossOrderId,
  orderName: "나이키 에어맥스 270",
  successUrl: `${origin}/payment/success?transactionId=${transactionId}&orderId=${tossOrderId}`,
  failUrl: `${origin}/payment/fail?transactionId=${transactionId}&orderId=${tossOrderId}`,
})
```

**사용자 액션**
- 카드 정보 입력
- 결제 승인 or 취소

**결과**
- 성공: `/payment/success?paymentKey=xxx&orderId=xxx&amount=xxx` 리다이렉트
- 실패: `/payment/fail?code=USER_CANCEL&message=xxx` 리다이렉트

---

### 3️⃣ 결제 승인 (Backend ↔ Toss API)

**Frontend**
```typescript
// app/payment/success/page.tsx
useEffect(() => {
  const paymentKey = searchParams.get("paymentKey")
  const transactionId = searchParams.get("transactionId")
  
  await confirmTransaction(Number(transactionId), paymentKey)
}, [])
```

**Backend API**
```http
POST /api/v1/transactions/{transactionId}/confirm
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "paymentKey": "tviva20231123123456789012"
}
```

**백엔드 처리**
1. Transaction에서 `tossOrderId`, `amount` 조회
2. Toss Payments Confirm API 호출
   ```java
   // TossPaymentsClientImpl.java
   POST https://api.tosspayments.com/v1/payments/confirm
   Authorization: Basic {Base64(secretKey:)}
   Content-Type: application/json
   
   {
     "paymentKey": "tviva20231123123456789012",
     "orderId": "550e8400-e29b-41d4-a716-446655440000",
     "amount": 50000
   }
   ```
3. Toss 응답 검증 후 DB 업데이트
   - Payment: `status = PENDING → ESCROWED`, `receiptUrl` 저장
   - SalePost: `status = AVAILABLE → RESERVED`
   - Transaction: `status = PENDING_APPROVAL` 유지

**결과**
- Frontend: 3초 후 `/sale-posts` 리다이렉트
- 구매자: "판매자가 수락하면 거래가 시작됩니다" 메시지

---

### 4️⃣ 판매자 수락

**Backend API**
```http
POST /api/v1/transactions/{transactionId}/accept
Authorization: Bearer {sellerAccessToken}
```

**백엔드 처리**
- Transaction: `status = PENDING_APPROVAL → APPROVED`
- SalePost: `status = RESERVED → TRADING`

**결과**
- 구매자에게 알림 (선택적)
- 물건 발송 단계

---

### 5️⃣ 구매 확정 (구매자)

**Backend API**
```http
POST /api/v1/transactions/{transactionId}/complete
Authorization: Bearer {buyerAccessToken}
```

**백엔드 처리**
- Transaction: `status = APPROVED → CONFIRMED`
- SalePost: `status = TRADING → COMPLETED`
- Payment: `status = ESCROWED → SETTLED`
- **판매자에게 정산 시작**

---

### 6️⃣ 구매자 취소 (선택적)

**조건**: 판매자 수락 전(`PENDING_APPROVAL`) 상태에서만 가능

**Backend API**
```http
POST /api/v1/transactions/{transactionId}/cancel-buyer
Authorization: Bearer {buyerAccessToken}
```

**백엔드 처리**
- Transaction: `status = PENDING_APPROVAL → CANCELLED_BY_BUYER`
- SalePost: `status = RESERVED → AVAILABLE`
- Payment: `status = ESCROWED → REFUNDED`
- **환불 처리 시작**

---

## 🔧 구현된 파일

### Frontend API Client

#### `/lib/api/transactions.ts`
```typescript
// 주요 함수
- requestTransaction(request)          // 거래 요청
- confirmTransaction(id, paymentKey)   // 결제 승인
- acceptTransaction(id)                // 판매자 수락
- completeTransaction(id)              // 구매 확정
- cancelTransactionByBuyer(id)         // 구매자 취소
- generateTossOrderId()                // UUID 생성 헬퍼

// Enum
- PaymentMethod: ACCOUNT_TRANSFER, EASY_PAY
- TransactionStatus: PENDING_APPROVAL, APPROVED, CONFIRMED, ...
- PaymentStatus: PENDING, ESCROWED, SETTLED, REFUNDED
```

### Frontend Components

#### `/components/sale-post/PurchaseButton.tsx`
- 로그인 확인
- 판매 가능 상태 확인 (`AVAILABLE`만)
- `requestTransaction` API 호출
- Toss SDK 동적 로드
- 결제 위젯 열기
- 에러 처리 (채팅 필요, 본인 구매 불가)

#### `/app/payment/success/page.tsx`
- URL 파라미터 추출: `paymentKey`, `transactionId`, `orderId`
- `confirmTransaction` API 호출
- 3가지 상태: processing, success, error
- 성공 시 3초 후 `/sale-posts` 리다이렉트

#### `/app/payment/fail/page.tsx`
- 에러 코드별 메시지 매핑
- `USER_CANCEL`, `INVALID_CARD_COMPANY`, 등
- "다시 시도하기" / "판매글 목록" 버튼

---

## 🔑 환경 변수

### Frontend (`.env.development`)
```env
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_O5vdkJeQVx7Dd6Dqm2XD87YmpXyJ
```

### Backend (백엔드 환경 변수)
```env
TOSS_SECRET_KEY=test_sk_1234567890abcdefghijk
toss.api.url.confirm=https://api.tosspayments.com/v1/payments/confirm
```

---

## 🧪 테스트 가이드

### 1. 로컬 환경 준비
```bash
# 백엔드 실행 (포트 8080)
cd backend
./gradlew bootRun

# 프론트엔드 실행 (포트 3000)
cd frontend
pnpm dev
```

### 2. 테스트 시나리오

#### ✅ 정상 결제 흐름
1. 로그인
2. 판매글 상세 페이지 이동
3. 판매자와 채팅 (최소 1회)
4. "구매하기" 버튼 클릭
5. 카드 정보 입력: `4000000000000001` (테스트 카드)
6. 결제 성공 페이지 확인
7. 판매자 계정으로 로그인 → 거래 수락
8. 구매자 계정으로 로그인 → 구매 확정

#### ❌ 에러 케이스
- 채팅 없이 구매 시도: "거래를 시작하려면 판매자와 먼저 채팅을 시작해주세요"
- 본인 판매글 구매 시도: "본인의 판매글은 구매할 수 없습니다"
- 결제 취소: `/payment/fail` 페이지 리다이렉트
- 판매 완료 상태: "구매하기" 버튼 비활성화

---

## 📊 상태 전이 다이어그램

```
[구매자] → requestTransaction
    ↓
[Transaction: PENDING_APPROVAL]
[Payment: PENDING]
[SalePost: AVAILABLE]
    ↓
[구매자] → Toss 결제 위젯
    ↓
[Frontend] → confirmTransaction
    ↓
[Backend] → Toss Confirm API
    ↓
[Transaction: PENDING_APPROVAL]
[Payment: ESCROWED] 💰
[SalePost: RESERVED] 🔒
    ↓
[판매자] → acceptTransaction
    ↓
[Transaction: APPROVED]
[SalePost: TRADING] 📦
    ↓
[구매자] → completeTransaction
    ↓
[Transaction: CONFIRMED]
[Payment: SETTLED] ✅
[SalePost: COMPLETED] 🎉
```

**취소 경로**
```
[PENDING_APPROVAL] → cancelTransactionByBuyer
    ↓
[Transaction: CANCELLED_BY_BUYER]
[Payment: REFUNDED] 💸
[SalePost: AVAILABLE]
```

---

## 🐛 트러블슈팅

### 1. "토스 페이먼츠 클라이언트 키가 설정되지 않았습니다"
**원인**: `.env.development`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY` 누락
**해결**: 환경 변수 추가 후 `pnpm dev` 재시작

### 2. "채팅방이 존재하지 않습니다"
**원인**: 판매자와 채팅 이력 없음
**해결**: 판매글 상세 페이지에서 "채팅하기" 버튼으로 대화 시작

### 3. Toss API 타임아웃 (10분 초과)
**원인**: `confirmTransaction` 호출이 너무 늦음
**해결**: 결제 성공 후 즉시 confirm 호출 (현재 자동 처리)

### 4. 금액 불일치 에러
**원인**: Toss에 전달한 `amount`와 백엔드의 `Transaction.price`가 다름
**해결**: `requestTransaction`에서 정확한 판매글 가격 전달

---

## 🔐 보안 고려사항

### 1. 클라이언트 키 노출
- ✅ `NEXT_PUBLIC_TOSS_CLIENT_KEY`는 공개 키 (프론트엔드 노출 허용)
- ❌ `TOSS_SECRET_KEY`는 절대 프론트엔드에 노출 금지 (백엔드에만)

### 2. CSRF 방지
- Backend: `orderId`(UUID)로 중복 결제 방지
- Pessimistic Lock: 동시 거래 요청 방지

### 3. JWT 인증
- 모든 거래 API는 `Authorization: Bearer {token}` 필수
- 판매자/구매자 권한 검증

---

## 📞 지원

### Toss Payments 문서
- 개발자 가이드: https://docs.tosspayments.com/
- 테스트 카드: https://docs.tosspayments.com/reference/test-card
- API 레퍼런스: https://docs.tosspayments.com/reference

### OOT 프로젝트
- 백엔드 레포: (링크)
- 프론트엔드 레포: (링크)
- 이슈 트래커: (링크)

---

## ✅ 체크리스트

프로덕션 배포 전 확인사항:

- [ ] 실제 Toss 클라이언트 키로 교체 (`live_ck_...`)
- [ ] 백엔드 시크릿 키 교체 (`live_sk_...`)
- [ ] 결제 테스트 (최소 3건)
- [ ] 환불 테스트 (최소 1건)
- [ ] 에러 핸들링 확인
- [ ] 로그 모니터링 설정
- [ ] HTTPS 적용
- [ ] CSP 헤더 설정
- [ ] Rate Limiting 적용
- [ ] 알림 시스템 연동 (판매자 수락, 구매 확정)

---

**작성일**: 2025년 11월 14일  
**버전**: 1.0.0  
**작성자**: GitHub Copilot
