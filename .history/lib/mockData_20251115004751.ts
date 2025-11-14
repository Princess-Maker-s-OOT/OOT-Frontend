export type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

// 카테고리 트리 목데이터 (더 이상 사용하지 않음 - API에서 가져옴)
export function getMockCategories(): CategoryNode[] {
  console.warn("getMockCategories는 더 이상 사용되지 않습니다. API를 사용하세요.")
  return []
}
