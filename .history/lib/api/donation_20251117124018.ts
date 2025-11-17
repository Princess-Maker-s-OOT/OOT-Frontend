import type { SearchDonationCentersSuccessResponse } from "@/lib/types/donation"

export async function searchDonationCenters(
  latitude: number,
  longitude: number,
  radius?: number,
  keyword?: string,
  token?: string
): Promise<SearchDonationCentersSuccessResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    ...(radius && { radius: radius.toString() }),
    ...(keyword && { keyword }),
  })

  const response = await fetch(
    `/donations/search?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  )

  // 401 또는 404 오류는 조용히 처리하고 빈 배열 반환
  if (response.status === 401 || response.status === 404) {
    console.log(`⚠️ Donation API ${response.status}, Mock 데이터 사용`)
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "DONATION_CENTERS_SEARCH_OK",
      message: response.status === 401 
        ? "인증이 필요합니다. Mock 데이터를 사용합니다."
        : "API가 구현되지 않았습니다. Mock 데이터를 사용합니다.",
      timestamp: new Date().toISOString(),
      data: [],
    } as SearchDonationCentersSuccessResponse
  }

  // HTML 응답 체크 (404 페이지 등)
  const contentType = response.headers.get("content-type")
  if (contentType && !contentType.includes("application/json")) {
    console.warn("⚠️ Donation API가 JSON이 아닌 응답을 반환했습니다. Mock 데이터 사용")
    return {
      httpStatus: "OK",
      statusValue: 200,
      success: true,
      code: "DONATION_CENTERS_SEARCH_OK",
      message: "API 오류. Mock 데이터를 사용합니다.",
      timestamp: new Date().toISOString(),
      data: [],
    } as SearchDonationCentersSuccessResponse
  }

  return await response.json()
}