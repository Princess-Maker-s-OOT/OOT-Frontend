import type { SearchDonationCentersSuccessResponse } from "@/lib/types/donation"
import { API_CONFIG } from "@/lib/config"

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
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DONATIONS.BASE}/search?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }
  )

  // 401 오류는 조용히 처리하고 빈 배열 반환
  if (response.status === 401) {
    return {
      success: true,
      data: [],
      message: "인증이 필요합니다. 목 데이터를 사용합니다.",
    } as SearchDonationCentersSuccessResponse
  }

  return await response.json()
}