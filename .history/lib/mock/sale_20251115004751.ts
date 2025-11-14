// 이 파일은 더 이상 사용되지 않습니다.
// 판매글 데이터는 API를 통해 가져옵니다.

export type MockSalePost = {
  salePostId: number;
  title: string;
  content: string;
  price: number;
  status: "AVAILABLE" | "SOLD" | "RESERVED";
  tradeAddress: string;
  tradeLatitude: number;
  tradeLongitude: number;
  sellerId: number;
  sellerNickname: string;
  categoryName: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
};

export function getMockSalePosts(): MockSalePost[] {
  console.warn("getMockSalePosts는 더 이상 사용되지 않습니다. API를 사용하세요.");
  return [];
}

export function getMockSalePostById(id: number): MockSalePost | null {
  console.warn("getMockSalePostById는 더 이상 사용되지 않습니다. API를 사용하세요.");
  return null;
}