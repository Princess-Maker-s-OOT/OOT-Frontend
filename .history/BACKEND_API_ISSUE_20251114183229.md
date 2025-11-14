# 백엔드 API 수정 요청

## 문제 상황
현재 카테고리 API (`GET /api/v1/categories`)의 응답에 `parentId` 필드가 포함되어 있지 않아, 프론트엔드에서 계층 구조를 구성할 수 없습니다.

## 현재 응답 구조
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 100,
        "name": "티셔츠",
        "createdAt": "2025-11-13T07:04:52",
        "updatedAt": "2025-11-13T07:04:52"
      }
    ]
  }
}
```

## 요청 사항
CategoryResponse DTO에 `parentId` 필드를 추가해주세요.

### 수정 예시 (백엔드)

```java
// CategoryResponse.java
public class CategoryResponse {
    private Long id;
    private String name;
    private Long parentId;  // ← 추가 필요
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

## 수정 후 예상 응답
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": 1,
        "name": "남성",
        "parentId": null,
        "createdAt": "2025-11-13T07:04:52",
        "updatedAt": "2025-11-13T07:04:52"
      },
      {
        "id": 10,
        "name": "아우터",
        "parentId": 1,
        "createdAt": "2025-11-13T07:04:52",
        "updatedAt": "2025-11-13T07:04:52"
      },
      {
        "id": 101,
        "name": "자켓",
        "parentId": 10,
        "createdAt": "2025-11-13T07:04:52",
        "updatedAt": "2025-11-13T07:04:52"
      }
    ]
  }
}
```

## 프론트엔드 준비 상태
- ✅ `CategoryResponse` 타입에 `parentId?: number | null` 추가 완료
- ✅ `buildCategoryTree()` 함수로 계층 구조 구성 로직 준비 완료
- ⏳ 백엔드 API 수정 대기 중

백엔드에서 `parentId`만 추가하면 즉시 3단계 계층 구조(남성/여성/아동 → 아우터/상의/하의 → 자켓/코트 등)가 작동합니다.
