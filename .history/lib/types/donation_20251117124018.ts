export interface DonationCenter {
  donationCenterId: number
  kakaoPlaceId: string
  name: string
  address: string
  phoneNumber: string | null
  operatingHours: string | null
  latitude: number
  longitude: number
  description: string
  distance: number
}

export interface SearchDonationCentersSuccessResponse {
  httpStatus: "OK"
  statusValue: 200
  success: true
  code: "DONATION_CENTERS_SEARCH_OK"
  message: string
  timestamp: string
  data: DonationCenter[]
}