// types
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

export type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

// 판매글 목데이터
const MOCK_POSTS: MockSalePost[] = [
  {
    salePostId: 1,
    title: "빈티지 데님 자켓",
    content: "빈티지 데님 자켓 상태 A. 멋스러운 디자인.",
    price: 45000,
    status: "AVAILABLE",
    tradeAddress: "강남구 역삼동",
    tradeLatitude: 37.499,
    tradeLongitude: 127.036,
    sellerId: 101,
    sellerNickname: "seller_one",
    categoryName: "Outerwear",
    imageUrls: ["/vintage-denim-jacket.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 2,
    title: "블랙 가죽 부츠",
    content: "편안한 착화감의 블랙 가죽 부츠입니다.",
    price: 89000,
    status: "AVAILABLE",
    tradeAddress: "마포구 홍대입구",
    tradeLatitude: 37.555,
    tradeLongitude: 126.923,
    sellerId: 102,
    sellerNickname: "boots_seller",
    categoryName: "Footwear",
    imageUrls: ["/black-leather-boots.png"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 3,
    title: "블랙 롱 스커트",
    content: "심플한 블랙 롱 스커트입니다.",
    price: 120000,
    status: "RESERVED",
    tradeAddress: "송파구 잠실동",
    tradeLatitude: 37.511,
    tradeLongitude: 127.098,
    sellerId: 103,
    sellerNickname: "skirt_seller",
    categoryName: "Bottoms",
    imageUrls: ["/black-long-skirt.JPG"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 4,
    title: "미니멀 화이트 티셔츠",
    content: "데일리로 좋은 미니멀 티셔츠",
    price: 25000,
    status: "AVAILABLE",
    tradeAddress: "서초구 서초동",
    tradeLatitude: 37.494,
    tradeLongitude: 127.011,
    sellerId: 104,
    sellerNickname: "tee_seller",
    categoryName: "Tops",
    imageUrls: ["/white-minimalist-tshirt.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 5,
    title: "블루 블랙 도트 타이즈",
    content: "스타일리시한 도트 타이즈입니다.",
    price: 15000,
    status: "AVAILABLE",
    tradeAddress: "강남구 청담동",
    tradeLatitude: 37.521,
    tradeLongitude: 127.045,
    sellerId: 106,
    sellerNickname: "tights_seller",
    categoryName: "Accessories",
    imageUrls: ["/blue-black-dot-tights.JPG"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 6,
    title: "스트라이프 코튼 셔츠",
    content: "편하게 입기 좋은 스트라이프 셔츠",
    price: 42000,
    status: "AVAILABLE",
    tradeAddress: "종로구 삼청동",
    tradeLatitude: 37.582,
    tradeLongitude: 126.985,
    sellerId: 107,
    sellerNickname: "shirt_seller",
    categoryName: "Tops",
    imageUrls: ["/striped-cotton-shirt.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    salePostId: 7,
    title: "캔버스 스니커즈",
    content: "편안한 캔버스 스니커즈입니다.",
    price: 55000,
    status: "RESERVED",
    tradeAddress: "성동구 성수동",
    tradeLatitude: 37.544,
    tradeLongitude: 127.040,
    sellerId: 108,
    sellerNickname: "sneaker_seller",
    categoryName: "Footwear",
    imageUrls: ["/canvas-sneakers-white.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getMockSalePosts(): MockSalePost[] {
  return MOCK_POSTS;
}

export function getMockSalePostById(id: number): MockSalePost | null {
  return MOCK_POSTS.find((p) => p.salePostId === id) ?? null;
}

// 카테고리 트리 목데이터 (더 이상 사용하지 않음 - API에서 가져옴)
export function getMockCategories(): CategoryNode[] {
  console.warn("getMockCategories는 더 이상 사용되지 않습니다. API를 사용하세요.")
  return []
}
