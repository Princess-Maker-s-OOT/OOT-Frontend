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
          ],
        },
        {
          id: 103,
          name: "하의",
          children: [
            { id: 10301, name: "청바지" },
            { id: 10302, name: "슬랙스" },
            { id: 10303, name: "조거팬츠" },
            { id: 10304, name: "반바지" },
            { id: 10305, name: "트레이닝팬츠" },
          ],
        },
        {
          id: 104,
          name: "신발",
          children: [
            { id: 10401, name: "스니커즈" },
            { id: 10402, name: "부츠" },
            { id: 10403, name: "샌들" },
            { id: 10404, name: "로퍼" },
            { id: 10405, name: "구두" },
          ],
        },
        {
          id: 105,
          name: "가방",
          children: [
            { id: 10501, name: "백팩" },
            { id: 10502, name: "크로스백" },
            { id: 10503, name: "클러치백" },
            { id: 10504, name: "토트백" },
          ],
        },
        {
          id: 106,
          name: "액세서리",
          children: [
            { id: 10601, name: "모자" },
            { id: 10602, name: "벨트" },
            { id: 10603, name: "시계" },
            { id: 10604, name: "팔찌" },
            { id: 10605, name: "선글라스" },
            { id: 10606, name: "머플러/스카프" },
          ],
        },
        {
          id: 107,
          name: "이너웨어",
          children: [
            { id: 10701, name: "러닝/탱크탑" },
            { id: 10702, name: "드로즈/트렁크" },
          ],
        },
        {
          id: 108,
          name: "라이프웨어",
          children: [
            { id: 10801, name: "홈웨어" },
            { id: 10802, name: "스포츠웨어" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "여성",
      children: [
        {
          id: 201,
          name: "아우터",
          children: [
            { id: 20101, name: "코트" },
            { id: 20102, name: "재킷" },
            { id: 20103, name: "가디건" },
            { id: 20104, name: "블루종" },
            { id: 20105, name: "패딩" },
          ],
        },
        {
          id: 202,
          name: "상의",
          children: [
            { id: 20201, name: "블라우스" },
            { id: 20202, name: "니트" },
            { id: 20203, name: "티셔츠" },
            { id: 20204, name: "후드티" },
          ],
        },
        {
          id: 203,
          name: "하의",
          children: [
            { id: 20301, name: "스커트" },
            { id: 20302, name: "팬츠" },
            { id: 20303, name: "반바지" },
            { id: 20304, name: "슬랙스" },
          ],
        },
        {
          id: 204,
          name: "신발",
          children: [
            { id: 20401, name: "플랫슈즈" },
            { id: 20402, name: "힐" },
            { id: 20403, name: "부츠" },
            { id: 20404, name: "스니커즈" },
            { id: 20405, name: "로퍼" },
          ],
        },
        {
          id: 205,
          name: "가방",
          children: [
            { id: 20501, name: "크로스백" },
            { id: 20502, name: "숄더백" },
            { id: 20503, name: "토트백" },
            { id: 20504, name: "미니백" },
          ],
        },
        {
          id: 206,
          name: "액세서리",
          children: [
            { id: 20601, name: "목걸이" },
            { id: 20602, name: "귀걸이" },
            { id: 20603, name: "팔찌" },
            { id: 20604, name: "반지" },
            { id: 20605, name: "헤어악세서리" },
            { id: 20606, name: "스카프" },
          ],
        },
        {
          id: 207,
          name: "원피스",
          children: [
            { id: 20701, name: "캐주얼원피스" },
            { id: 20702, name: "롱원피스" },
            { id: 20703, name: "미니원피스" },
          ],
        },
        {
          id: 208,
          name: "이너웨어",
          children: [
            { id: 20801, name: "브라탑" },
            { id: 20802, name: "팬티" },
            { id: 20803, name: "스타킹" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "아동",
      children: [
        {
          id: 301,
          name: "아우터",
          children: [
            { id: 30101, name: "자켓" },
            { id: 30102, name: "코트" },
            { id: 30103, name: "패딩" },
          ],
        },
        {
          id: 302,
          name: "상의",
          children: [
            { id: 30201, name: "티셔츠" },
            { id: 30202, name: "맨투맨" },
            { id: 30203, name: "니트" },
          ],
        },
        {
          id: 303,
          name: "하의",
          children: [
            { id: 30301, name: "바지" },
            { id: 30302, name: "반바지" },
            { id: 30303, name: "레깅스" },
          ],
        },
        {
          id: 304,
          name: "신발",
          children: [
            { id: 30401, name: "스니커즈" },
            { id: 30402, name: "샌들" },
            { id: 30403, name: "부츠" },
          ],
        },
        {
          id: 305,
          name: "액세서리",
          children: [
            { id: 30501, name: "모자" },
            { id: 30502, name: "가방" },
            { id: 30503, name: "헤어핀" },
          ],
        },
      ],
    },
  ];
}
