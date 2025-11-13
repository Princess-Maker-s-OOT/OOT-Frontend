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
        ...(token && { Authorization: token }),
      },
    }
  )
  return await response.json()
}