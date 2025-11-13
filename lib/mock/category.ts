export type CategoryNode = {
  id: number;
  name: string;
  children?: CategoryNode[];
};

const MOCK_CATEGORIES: CategoryNode[] = [
  {
    id: 1,
    name: "남성",
    children: [
      {
        id: 101,
        name: "아우터",
        children: [
          { id: 10101, name: "자켓" },
          { id: 10102, name: "코트" },
          { id: 10103, name: "패딩" },
          { id: 10104, name: "가디건" },
          { id: 10105, name: "블루종" },
          { id: 10106, name: "후리스" },
          { id: 10107, name: "후드집업" },
        ],
      },
      {
        id: 102,
        name: "상의",
        children: [
          { id: 10201, name: "반팔 티셔츠" },
          { id: 10202, name: "긴팔 티셔츠" },
          { id: 10203, name: "셔츠" },
          { id: 10204, name: "맨투맨" },
          { id: 10205, name: "니트" },
          { id: 10206, name: "후드티" },
          { id: 10207, name: "민소매" },
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

export function getMockCategories(): CategoryNode[] {
  return MOCK_CATEGORIES;
}