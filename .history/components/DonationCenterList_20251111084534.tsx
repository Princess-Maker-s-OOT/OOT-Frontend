"use client"

import { useEffect, useState, useRef } from "react"
import { searchDonationCenters } from "@/lib/api/donation"
import type { DonationCenter } from "@/lib/types/donation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingState } from "@/components/ui/loading-state"
import { STYLE_CONSTANTS } from "@/lib/constants/styles"
import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const MOCK_DONATION_CENTERS: DonationCenter[] = [
  {
    donationCenterId: 1,
    kakaoPlaceId: "12345678",
    name: "서울 기부센터",
    address: "서울시 강남구 테헤란로 123",
    phoneNumber: "02-1234-5678",
    operatingHours: "09:00 ~ 18:00",
    latitude: 37.4979,
    longitude: 127.0276,
    distance: 250.5,
    description: "의류 기부 전문 센터입니다.",
  },
  {
    donationCenterId: 2,
    kakaoPlaceId: "87654321",
    name: "동대문 자선단체",
    address: "서울시 동대문구 무학로 456",
    phoneNumber: "02-8765-4321",
    operatingHours: "10:00 ~ 19:00",
    latitude: 37.5745,
    longitude: 127.0086,
    distance: 1250.3,
    description: "다양한 기부를 받고 있습니다.",
  },
  {
    donationCenterId: 3,
    kakaoPlaceId: "11111111",
    name: "강북 나눔터",
    address: "서울시 강북구 삼양로 789",
    phoneNumber: null,
    operatingHours: "09:00 ~ 17:00",
    latitude: 37.6386,
    longitude: 127.0096,
    distance: 2100.0,
    description: "의류와 물품을 기부받습니다.",
  },
]

export default function DonationCenterList() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowsRef = useRef<any[]>([])

  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        },
        () => {
          setUserLocation({ lat: 37.5665, lng: 126.978 })
        }
      )
    }
  }, [])

  useEffect(() => {
    if (!userLocation || !mapContainer.current || !isMounted) return

    const loadKakaoMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
        if (!apiKey) {
          console.error("❌ 카카오맵 API 키가 설정되지 않았습니다.")
          setError("카카오맵 API 키 설정이 필요합니다.")
          return
        }

        const kakao = (window as any).kakao
        if (kakao && kakao.maps) {
          setTimeout(() => initMap(), 100)
          return
        }

        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script")
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing`
          script.async = true
          script.defer = true
          script.onload = () => {
            setTimeout(() => {
              try {
                initMap()
                resolve()
              } catch (err) {
                reject(err)
              }
            }, 300)
          }
          script.onerror = (err) => {
            console.error("❌ 카카오맵 SDK 로드 실패:", err)
            setError("카카오맵 SDK를 불러올 수 없습니다.")
            reject(err)
          }
          document.head.appendChild(script)
        })
      } catch (err) {
        console.error("❌ 카카오맵 로드 중 예외 발생:", err)
        setError("카카오맵을 초기화할 수 없습니다.")
      }
    }

    loadKakaoMap()
  }, [userLocation, isMounted])

  const initMap = () => {
    if (!mapContainer.current || !userLocation) return
    try {
      const kakao = (window as any).kakao
      if (!kakao || !kakao.maps) {
        setError("카카오맵을 불러올 수 없습니다.")
        return
      }

      const mapOptions = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      }

      const map = new kakao.maps.Map(mapContainer.current, mapOptions)
      mapRef.current = map

      const userMarker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        title: "내 위치",
        image: new kakao.maps.MarkerImage(
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
          new kakao.maps.Size(24, 35),
          { offset: new kakao.maps.Point(12, 35) }
        ),
      })
      userMarker.setMap(map)

      addMarkers(map, centers)
    } catch (err) {
      console.error("Map initialization error:", err)
      setError("지도를 초기화할 수 없습니다.")
    }
  }

  const addMarkers = (map: any, centersList: DonationCenter[]) => {
    const kakao = (window as any).kakao
    if (!kakao) return

    markersRef.current.forEach((marker) => marker.setMap(null))
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
    markersRef.current = []
    infoWindowsRef.current = []

    centersList.forEach((center) => {
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(center.latitude, center.longitude),
        title: center.name,
      })
      marker.setMap(map)

      const infoWindow = new kakao.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">
            <strong style="font-size: 14px;">${center.name}</strong><br/>
            <span style="color: #666;">${center.address}</span>
            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}
            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}
          </div>
        `,
      })

      kakao.maps.event.addListener(marker, "click", () => {
        infoWindowsRef.current.forEach((iw) => iw.close())
        infoWindow.open(map, marker)
        setSelectedCenter(center)
      })

      markersRef.current.push(marker)
      infoWindowsRef.current.push(infoWindow)
    })
  }

  const handleSearch = async () => {
    if (!userLocation) {
      setError("위치 정보를 가져올 수 없습니다.")
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const result = await searchDonationCenters(userLocation.lat, userLocation.lng, 5000, searchKeyword || undefined)
      if ("data" in result) {
        setCenters(result.data)
        if (mapRef.current) addMarkers(mapRef.current, result.data)
      } else {
        setError((result as any).message || "검색에 실패했습니다.")
      }
    } catch (err) {
      console.error(err)
      setError("검색 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <LoadingState isLoading={isLoading} error={error}>
      <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">근처 기부처 찾기</h1>
          <p className="text-muted-foreground">카카오맵으로 주변 기부처를 쉽게 찾아보세요</p>
        </div>

        <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mb-8")}>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="검색 키워드 입력 (예: 의류기부, 헌옷수거함)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={cn(STYLE_CONSTANTS.FORM.INPUT, "flex-1")}
              aria-label="기부처 검색 키워드"
            />
            <Button onClick={handleSearch} className="bg-oot-sky-accent text-white hover:bg-sky-600" disabled={isLoading} aria-label="검색">
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, "overflow-hidden p-0")}>
              <div ref={mapContainer} className="w-full h-[600px] bg-muted" style={{ minHeight: "600px" }} aria-label="카카오맵 기부처 검색" />
            </Card>
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">기부처 목록 ({centers.length})</h2>
            </div>

            <div className={cn(STYLE_CONSTANTS.SPACING.SM, "space-y-3")}>
              {centers.map((center) => (
                <Card
                  key={center.donationCenterId}
                  className={cn(
                    STYLE_CONSTANTS.CARD.HOVER,
                    STYLE_CONSTANTS.PADDING.MD,
                    "cursor-pointer transition-all",
                    selectedCenter?.donationCenterId === center.donationCenterId ? "ring-2 ring-oot-sky-accent bg-oot-sky-50" : ""
                  )}
                  onClick={() => setSelectedCenter(center)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setSelectedCenter(center) }}
                  aria-label={`${center.name} 선택`}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">{center.name}</h3>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{center.address}</span>
                    </div>

                    {center.phoneNumber && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <a href={`tel:${center.phoneNumber}`} className="hover:text-oot-sky-accent underline" aria-label={`${center.name}에 전화 걸기`}>{center.phoneNumber}</a>
                      </div>
                    )}

                    {center.operatingHours && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{center.operatingHours}</span>
                      </div>
                    )}

                    {center.distance !== null && center.distance !== undefined && (
                      <div className="pt-2 border-t border-border">
                        <span className="text-xs font-semibold text-oot-sky-accent">📍 {center.distance.toFixed(0)}m</span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {centers.length === 0 && (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
                  <p className="text-xs text-muted-foreground mt-1">다른 키워드로 검색해보세요.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedCenter && (
          <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mt-8")}>
            <h2 className="text-xl font-bold text-foreground mb-4">{selectedCenter.name}</h2>

            <div className={STYLE_CONSTANTS.SPACING.SM}>
              <div>
                <span className="text-sm font-medium text-muted-foreground">주소</span>
                <p className="text-sm text-foreground">{selectedCenter.address}</p>
              </div>

              {selectedCenter.phoneNumber && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">전화번호</span>
                  <a href={`tel:${selectedCenter.phoneNumber}`} className="text-sm text-oot-sky-accent hover:underline">{selectedCenter.phoneNumber}</a>
                </div>
              )}

              {selectedCenter.operatingHours && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">운영시간</span>
                  <p className="text-sm text-foreground">{selectedCenter.operatingHours}</p>
                </div>
              )}

              {selectedCenter.description && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">설명</span>
                  <p className="text-sm text-foreground">{selectedCenter.description}</p>
                </div>
              )}

              {selectedCenter.distance !== null && selectedCenter.distance !== undefined && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">현재 위치로부터</span>
                  <p className="text-sm text-foreground">{selectedCenter.distance < 1000 ? `${selectedCenter.distance.toFixed(0)}m` : `${(selectedCenter.distance / 1000).toFixed(1)}km`}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button className="w-full bg-oot-sky-accent text-white hover:bg-sky-600" onClick={() => window.open(`https://map.kakao.com/link/map/${selectedCenter.name},${selectedCenter.latitude},${selectedCenter.longitude}`, "_blank") }>
                카카오맵에서 보기
              </Button>
            </div>
          </Card>
        )}
      </div>
    </LoadingState>
  )
}
"use client""use client""use client"



import { useEffect, useState, useRef } from "react"

import { searchDonationCenters } from "@/lib/api/donation"

import { useKakaoMaps } from "@/hooks/useKakaoMaps"import { useEffect, useState, useRef } from "react"import { useEffect, useState, useRef } from "react"

import type { DonationCenter } from "@/lib/types/donation"

import { Card } from "@/components/ui/card"import { searchDonationCenters } from "@/lib/api/donation"import { searchDonationCenters } from "@/lib/api/donation"

import { Button } from "@/components/ui/button"

import { STYLE_CONSTANTS } from "@/lib/constants/styles"import { useKakaoMaps } from "@/hooks/useKakaoMaps"import { useKakaoMaps } from "@/hooks/useKakaoMaps"

import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"import type { DonationCenter } from "@/lib/types/donation"import type { DonationCenter } from "@/lib/types/donation"



const MOCK_DONATION_CENTERS: DonationCenter[] = [import { Card } from "@/components/ui/card"import { Card } from "@/components/ui/card"

  {

    donationCenterId: 1,import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

    kakaoPlaceId: "12345678",

    name: "서울 기부센터",import { LoadingState } from "@/components/ui/loading-state"import { LoadingState } from "@/components/ui/loading-state"

    address: "서울시 강남구 테헤란로 123",

    phoneNumber: "02-1234-5678",import { STYLE_CONSTANTS } from "@/lib/constants/styles"import { STYLE_CONSTANTS } from "@/lib/constants/styles"

    operatingHours: "09:00 ~ 18:00",

    latitude: 37.4979,import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"

    longitude: 127.0276,

    distance: 250.5,import { cn } from "@/lib/utils"import { cn } from "@/lib/utils"

    description: "의류 기부 전문 센터입니다.",

  },

  {

    donationCenterId: 2,const MOCK_DONATION_CENTERS: DonationCenter[] = [const MOCK_DONATION_CENTERS: DonationCenter[] = [

    kakaoPlaceId: "87654321",

    name: "동대문 자선단체",  {  {

    address: "서울시 동대문구 무학로 456",

    phoneNumber: "02-8765-4321",    donationCenterId: 1,    donationCenterId: 1,

    operatingHours: "10:00 ~ 19:00",

    latitude: 37.5745,    kakaoPlaceId: "12345678",    kakaoPlaceId: "12345678",

    longitude: 127.0086,

    distance: 1250.3,    name: "서울 기부센터",    name: "서울 기부센터",

    description: "다양한 기부를 받고 있습니다.",

  },    address: "서울시 강남구 테헤란로 123",    address: "서울시 강남구 테헤란로 123",

  {

    donationCenterId: 3,    phoneNumber: "02-1234-5678",    phoneNumber: "02-1234-5678",

    kakaoPlaceId: "11111111",

    name: "강북 나눔터",    operatingHours: "09:00 ~ 18:00",    operatingHours: "09:00 ~ 18:00",

    address: "서울시 강북구 삼양로 789",

    phoneNumber: null,    latitude: 37.4979,    latitude: 37.4979,

    operatingHours: "09:00 ~ 17:00",

    latitude: 37.6386,    longitude: 127.0276,    longitude: 127.0276,

    longitude: 127.0096,

    distance: 2100.0,    distance: 250.5,    distance: 250.5,

    description: "의류와 물품을 기부받습니다.",

  },    description: "의류 기부 전문 센터입니다.",    description: "의류 기부 전문 센터입니다.",

]

  },  },

export default function DonationCenterList() {

  const mapContainer = useRef<HTMLDivElement>(null)  {  {

  const mapRef = useRef<any>(null)

  const markersRef = useRef<any[]>([])    donationCenterId: 2,    donationCenterId: 2,

  const infoWindowsRef = useRef<any[]>([])

    kakaoPlaceId: "87654321",    kakaoPlaceId: "87654321",

  // 새로운 Kakao Maps 훅 사용 (싱글톤 패턴)

  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({    name: "동대문 자선단체",    name: "동대문 자선단체",

    autoLoad: true,

    onError: (error) => {    address: "서울시 동대문구 무학로 456",    address: "서울시 동대문구 무학로 456",

      console.error("❌ Kakao Maps loading failed:", error)

      setUseMapView(false)    phoneNumber: "02-8765-4321",    phoneNumber: "02-8765-4321",

    },

  })    operatingHours: "10:00 ~ 19:00",    operatingHours: "10:00 ~ 19:00",



  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)    latitude: 37.5745,    latitude: 37.5745,

  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState<string | undefined>()    longitude: 127.0086,    longitude: 127.0086,

  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)

  const [searchKeyword, setSearchKeyword] = useState("")    distance: 1250.3,    distance: 1250.3,

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [useMapView, setUseMapView] = useState(true)    description: "다양한 기부를 받고 있습니다.",    description: "다양한 기부를 받고 있습니다.",



  // 사용자 위치 가져오기  },  },

  useEffect(() => {

    if (navigator.geolocation) {  {  {

      navigator.geolocation.getCurrentPosition(

        (position) => {    donationCenterId: 3,    donationCenterId: 3,

          setUserLocation({

            lat: position.coords.latitude,    kakaoPlaceId: "11111111",    kakaoPlaceId: "11111111",

            lng: position.coords.longitude,

          })    name: "강북 나눔터",    name: "강북 나눔터",

        },

        () => {    address: "서울시 강북구 삼양로 789",    address: "서울시 강북구 삼양로 789",

          setUserLocation({ lat: 37.5665, lng: 126.978 })

        }    phoneNumber: null,    phoneNumber: null,

      )

    }    operatingHours: "09:00 ~ 17:00",    operatingHours: "09:00 ~ 17:00",

  }, [])

    latitude: 37.6386,    latitude: 37.6386,

  // 카카오맵 초기화

  useEffect(() => {    longitude: 127.0096,    longitude: 127.0096,

    if (!userLocation || !mapContainer.current || !kakaoLoaded || !useMapView) return

    distance: 2100.0,    distance: 2100.0,

    try {

      if (!kakao || !kakao.maps) {    description: "의류와 물품을 기부받습니다.",    description: "의류와 물품을 기부받습니다.",

        setError("카카오맵을 불러올 수 없습니다.")

        setUseMapView(false)  },  },

        return

      }]]



      const mapOptions = {

        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

        level: 5,export default function DonationCenterList() {export default function DonationCenterList() {

      }

  const mapContainer = useRef<HTMLDivElement>(null)  const mapContainer = useRef<HTMLDivElement>(null)

      const map = new kakao.maps.Map(mapContainer.current, mapOptions)

      mapRef.current = map  const mapRef = useRef<any>(null)  const mapRef = useRef<any>(null)



      const userMarker = new kakao.maps.Marker({  const markersRef = useRef<any[]>([])  const markersRef = useRef<any[]>([])

        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

        title: "내 위치",  const infoWindowsRef = useRef<any[]>([])  const infoWindowsRef = useRef<any[]>([])

        image: new kakao.maps.MarkerImage(

          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

          new kakao.maps.Size(24, 35),

          { offset: new kakao.maps.Point(12, 35) }  // 새로운 Kakao Maps 훅 사용 (싱글톤 패턴)  // 새로운 Kakao Maps 훅 사용

        ),

      })  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({

      userMarker.setMap(map)

    autoLoad: true,    autoLoad: true,

      addMarkers(map, centers)

      console.log("✅ Kakao Map initialized successfully")    onError: (error) => {    onError: (error) => {

    } catch (err) {

      console.error("❌ Map initialization error:", err)      console.error("❌ Kakao Maps loading failed:", error)      console.error("❌ Kakao Maps loading failed:", error)

      setError("지도를 초기화할 수 없습니다.")

      setUseMapView(false)      setUseMapView(false)      setError("카카오맵을 불러올 수 없습니다. 나중에 다시 시도해주세요.")

    }

  }, [userLocation, kakaoLoaded, kakao, centers, useMapView])    },    },



  const addMarkers = (map: any, centersList: DonationCenter[]) => {  })  })

    if (!kakao) return



    markersRef.current.forEach((marker) => marker.setMap(null))

    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)

    markersRef.current = []

    infoWindowsRef.current = []  const [isLoading, setIsLoading] = useState(false)  const [isLoading, setIsLoading] = useState(false)



    centersList.forEach((center) => {  const [error, setError] = useState<string | undefined>()  const [error, setError] = useState<string | undefined>()

      const marker = new kakao.maps.Marker({

        position: new kakao.maps.LatLng(center.latitude, center.longitude),  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)

        title: center.name,

      })  const [searchKeyword, setSearchKeyword] = useState("")  const [searchKeyword, setSearchKeyword] = useState("")

      marker.setMap(map)

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

      const infoWindow = new kakao.maps.InfoWindow({

        content: `  const [useMapView, setUseMapView] = useState(true)  const [useMapView, setUseMapView] = useState(true) // 지도 보기/목록 보기 토글

          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">

            <strong style="font-size: 14px;">${center.name}</strong><br/>

            <span style="color: #666;">${center.address}</span>

            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}  // 사용자 위치 가져오기  // 마운트 상태 확인

            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}

          </div>  useEffect(() => {  useEffect(() => {

        `,

      })    if (navigator.geolocation) {    // 클라이언트 사이드에서만 실행



      kakao.maps.event.addListener(marker, "click", () => {      navigator.geolocation.getCurrentPosition(  }, [])

        infoWindowsRef.current.forEach((iw) => iw.close())

        infoWindow.open(map, marker)        (position) => {

        setSelectedCenter(center)

      })          setUserLocation({  // 사용자 위치 가져오기



      markersRef.current.push(marker)            lat: position.coords.latitude,  useEffect(() => {

      infoWindowsRef.current.push(infoWindow)

    })            lng: position.coords.longitude,    if (navigator.geolocation) {

  }

          })      navigator.geolocation.getCurrentPosition(

  const handleSearch = async () => {

    if (!userLocation) {        },        (position) => {

      setError("위치 정보를 가져올 수 없습니다.")

      return        () => {          setUserLocation({

    }

          setUserLocation({ lat: 37.5665, lng: 126.978 })            lat: position.coords.latitude,

    setIsLoading(true)

    setError(undefined)        }            lng: position.coords.longitude,



    try {      )          })

      const result = await searchDonationCenters(

        userLocation.lat,    }        },

        userLocation.lng,

        5000,  }, [])        () => {

        searchKeyword || undefined

      )          setUserLocation({ lat: 37.5665, lng: 126.978 }) // 서울 기본 좌표



      if ("data" in result) {  // 카카오맵 초기화        }

        setCenters(result.data)

        if (mapRef.current) {  useEffect(() => {      )

          addMarkers(mapRef.current, result.data)

        }    if (!userLocation || !mapContainer.current || !kakaoLoaded || !useMapView) return    }

      } else {

        setError((result as any).message || "검색에 실패했습니다.")  }, [])

      }

    } catch (err) {    try {

      console.error(err)

      setError("검색 중 오류가 발생했습니다.")      if (!kakao || !kakao.maps) {  // 카카오맵 초기화

    } finally {

      setIsLoading(false)        setError("카카오맵을 불러올 수 없습니다.")  useEffect(() => {

    }

  }        setUseMapView(false)    if (!userLocation || !mapContainer.current || !kakaoLoaded) return



  return (        return

    <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>

      {kakaoError && (      }    try {

        <div className="mb-8">

          <Card className="border-red-300 bg-red-50 p-6">      if (!kakao || !kakao.maps) {

            <div className="flex items-start gap-3">

              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />      const mapOptions = {        setError("카카오맵을 불러올 수 없습니다.")

              <div>

                <h3 className="font-semibold text-red-900 mb-2">카카오맵 로딩 실패</h3>        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),        setUseMapView(false)

                <p className="text-sm text-red-800 mb-4">

                  카카오맵 SDK를 로드할 수 없습니다. 목록 보기를 사용해주세요.        level: 5,        return

                </p>

                <Button      }      }

                  onClick={() => setUseMapView(false)}

                  className="bg-red-600 hover:bg-red-700 text-white"

                >

                  목록 보기로 전환      const map = new kakao.maps.Map(mapContainer.current, mapOptions)      const mapOptions = {

                </Button>

              </div>      mapRef.current = map        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

            </div>

          </Card>        level: 5,

        </div>

      )}      const userMarker = new kakao.maps.Marker({      }



      <div className="mb-8">        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

        <h1 className="text-3xl font-bold text-foreground mb-2">근처 기부처 찾기</h1>

        <p className="text-muted-foreground">        title: "내 위치",      const map = new kakao.maps.Map(mapContainer.current, mapOptions)

          카카오맵으로 주변 기부처를 쉽게 찾아보세요

        </p>        image: new kakao.maps.MarkerImage(      mapRef.current = map

      </div>

          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

      <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mb-8")}>

        <div className="flex gap-3 mb-4">          new kakao.maps.Size(24, 35),      // 사용자 위치 마커

          <input

            type="text"          { offset: new kakao.maps.Point(12, 35) }      const userMarker = new kakao.maps.Marker({

            placeholder="검색 키워드 입력 (예: 의류기부, 헌옷수거함)"

            value={searchKeyword}        ),        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

            onChange={(e) => setSearchKeyword(e.target.value)}

            onKeyDown={(e) => e.key === "Enter" && handleSearch()}      })        title: "내 위치",

            className={cn(STYLE_CONSTANTS.FORM.INPUT, "flex-1")}

            aria-label="기부처 검색 키워드"      userMarker.setMap(map)        image: new kakao.maps.MarkerImage(

          />

          <Button          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

            onClick={handleSearch}

            className="bg-oot-sky-accent text-white hover:bg-sky-600"      addMarkers(map, centers)          new kakao.maps.Size(24, 35),

            disabled={isLoading}

            aria-label="검색"      console.log("✅ Kakao Map initialized successfully")          { offset: new kakao.maps.Point(12, 35) }

          >

            {isLoading ? "검색 중..." : "검색"}    } catch (err) {        ),

          </Button>

        </div>      console.error("❌ Map initialization error:", err)      })



        {kakaoLoaded && (      setError("지도를 초기화할 수 없습니다.")      userMarker.setMap(map)

          <div className="flex gap-2">

            <Button      setUseMapView(false)

              variant={useMapView ? "default" : "outline"}

              size="sm"    }      // 기부처 마커 표시

              onClick={() => setUseMapView(true)}

              className={useMapView ? "bg-oot-sky-accent text-white" : ""}  }, [userLocation, kakaoLoaded, kakao, centers, useMapView])      addMarkers(map, centers)

            >

              🗺️ 지도 보기      

            </Button>

            <Button  const addMarkers = (map: any, centersList: DonationCenter[]) => {      console.log("✅ Kakao Map initialized successfully")

              variant={!useMapView ? "default" : "outline"}

              size="sm"    if (!kakao) return    } catch (err) {

              onClick={() => setUseMapView(false)}

              className={!useMapView ? "bg-oot-sky-accent text-white" : ""}      console.error("❌ Map initialization error:", err)

            >

              📋 목록 보기    markersRef.current.forEach((marker) => marker.setMap(null))      setError("지도를 초기화할 수 없습니다.")

            </Button>

          </div>    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())      setUseMapView(false)

        )}

      </Card>    markersRef.current = []    }



      <div className={useMapView && kakaoLoaded ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}>    infoWindowsRef.current = []  }, [userLocation, kakaoLoaded, kakao, centers])

        {useMapView && kakaoLoaded && (

          <div className="lg:col-span-2">

            <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, "overflow-hidden p-0")}>

              <div    centersList.forEach((center) => {  const initMap = () => {

                ref={mapContainer}

                className="w-full h-[600px] bg-muted"      const marker = new kakao.maps.Marker({    if (!mapContainer.current || !userLocation) {

                style={{ minHeight: "600px" }}

                aria-label="카카오맵 기부처 검색"        position: new kakao.maps.LatLng(center.latitude, center.longitude),      console.warn("Map container or location not ready")

              />

            </Card>        title: center.name,      return

          </div>

        )}      })    }



        <div className={useMapView && kakaoLoaded ? "" : cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-4")}>      marker.setMap(map)

          <div className="mb-4">

            <h2 className="text-lg font-semibold text-foreground">    try {

              기부처 목록 ({centers.length})

            </h2>      const infoWindow = new kakao.maps.InfoWindow({      const kakao = (window as any).kakao

          </div>

        content: `      if (!kakao || !kakao.maps) {

          <div className={cn(STYLE_CONSTANTS.SPACING.SM, "space-y-3")}>

            {centers.map((center) => (          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">        console.error("Kakao maps not loaded")

              <Card

                key={center.donationCenterId}            <strong style="font-size: 14px;">${center.name}</strong><br/>        setError("카카오맵을 불러올 수 없습니다.")

                className={cn(

                  STYLE_CONSTANTS.CARD.HOVER,            <span style="color: #666;">${center.address}</span>        return

                  STYLE_CONSTANTS.PADDING.MD,

                  "cursor-pointer transition-all",            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}      }

                  selectedCenter?.donationCenterId === center.donationCenterId

                    ? "ring-2 ring-oot-sky-accent bg-oot-sky-50"            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}

                    : ""

                )}          </div>      const mapOptions = {

                onClick={() => setSelectedCenter(center)}

                role="button"        `,        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

                tabIndex={0}

                onKeyDown={(e) => {      })        level: 5,

                  if (e.key === "Enter" || e.key === " ") {

                    setSelectedCenter(center)      }

                  }

                }}      kakao.maps.event.addListener(marker, "click", () => {

                aria-label={`${center.name} 선택`}

              >        infoWindowsRef.current.forEach((iw) => iw.close())      const map = new kakao.maps.Map(mapContainer.current, mapOptions)

                <div className="space-y-2">

                  <h3 className="font-semibold text-sm text-foreground line-clamp-2">        infoWindow.open(map, marker)      mapRef.current = map

                    {center.name}

                  </h3>        setSelectedCenter(center)



                  <div className="flex items-start gap-2 text-xs text-muted-foreground">      })      // 사용자 위치 마커

                    <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />

                    <span className="line-clamp-2">{center.address}</span>      const userMarker = new kakao.maps.Marker({

                  </div>

      markersRef.current.push(marker)        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

                  {center.phoneNumber && (

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">      infoWindowsRef.current.push(infoWindow)        title: "내 위치",

                      <Phone className="h-4 w-4 flex-shrink-0" />

                      <a    })        image: new kakao.maps.MarkerImage(

                        href={`tel:${center.phoneNumber}`}

                        className="hover:text-oot-sky-accent underline"  }          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

                        aria-label={`${center.name}에 전화 걸기`}

                      >          new kakao.maps.Size(24, 35),

                        {center.phoneNumber}

                      </a>  const handleSearch = async () => {          { offset: new kakao.maps.Point(12, 35) }

                    </div>

                  )}    if (!userLocation) {        ),



                  {center.operatingHours && (      setError("위치 정보를 가져올 수 없습니다.")      })

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">

                      <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />      return      userMarker.setMap(map)

                      <span>{center.operatingHours}</span>

                    </div>    }

                  )}

      // 기부처 마커 표시

                  {center.distance !== null && center.distance !== undefined && (

                    <div className="pt-2 border-t border-border">    setIsLoading(true)      addMarkers(map, centers)

                      <span className="text-xs font-semibold text-oot-sky-accent">

                        📍 {center.distance.toFixed(0)}m    setError(undefined)    } catch (err) {

                      </span>

                    </div>      console.error("Map initialization error:", err)

                  )}

                </div>    try {      setError("지도를 초기화할 수 없습니다.")

              </Card>

            ))}      const result = await searchDonationCenters(    }



            {centers.length === 0 && (        userLocation.lat,  }

              <div className="text-center py-8">

                <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />        userLocation.lng,

                <p className="text-sm text-muted-foreground">

                  검색 결과가 없습니다.        5000,  const addMarkers = (map: any, centersList: DonationCenter[]) => {

                </p>

                <p className="text-xs text-muted-foreground mt-1">        searchKeyword || undefined    const kakao = (window as any).kakao

                  다른 키워드로 검색해보세요.

                </p>      )    if (!kakao) return

              </div>

            )}

          </div>

        </div>      if ("data" in result) {    // 기존 마커와 인포윈도우 제거

      </div>

        setCenters(result.data)    markersRef.current.forEach((marker) => marker.setMap(null))

      {selectedCenter && (

        <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mt-8")}>        if (mapRef.current) {    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())

          <h2 className="text-xl font-bold text-foreground mb-4">{selectedCenter.name}</h2>

          addMarkers(mapRef.current, result.data)    markersRef.current = []

          <div className={STYLE_CONSTANTS.SPACING.SM}>

            <div>        }    infoWindowsRef.current = []

              <span className="text-sm font-medium text-muted-foreground">주소</span>

              <p className="text-sm text-foreground">{selectedCenter.address}</p>      } else {

            </div>

        setError((result as any).message || "검색에 실패했습니다.")    centersList.forEach((center) => {

            {selectedCenter.phoneNumber && (

              <div>      }      const marker = new kakao.maps.Marker({

                <span className="text-sm font-medium text-muted-foreground">전화번호</span>

                <a    } catch (err) {        position: new kakao.maps.LatLng(center.latitude, center.longitude),

                  href={`tel:${selectedCenter.phoneNumber}`}

                  className="text-sm text-oot-sky-accent hover:underline"      console.error(err)        title: center.name,

                >

                  {selectedCenter.phoneNumber}      setError("검색 중 오류가 발생했습니다.")      })

                </a>

              </div>    } finally {      marker.setMap(map)

            )}

      setIsLoading(false)

            {selectedCenter.operatingHours && (

              <div>    }      const infoWindow = new kakao.maps.InfoWindow({

                <span className="text-sm font-medium text-muted-foreground">운영시간</span>

                <p className="text-sm text-foreground">{selectedCenter.operatingHours}</p>  }        content: `

              </div>

            )}          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">



            {selectedCenter.description && (  return (            <strong style="font-size: 14px;">${center.name}</strong><br/>

              <div>

                <span className="text-sm font-medium text-muted-foreground">설명</span>    <LoadingState isLoading={isLoading} error={error}>            <span style="color: #666;">${center.address}</span>

                <p className="text-sm text-foreground">{selectedCenter.description}</p>

              </div>      {kakaoError && (            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}

            )}

        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}

            {selectedCenter.distance !== null && selectedCenter.distance !== undefined && (

              <div>          <Card className="border-red-300 bg-red-50 p-6">          </div>

                <span className="text-sm font-medium text-muted-foreground">현재 위치로부터</span>

                <p className="text-sm text-foreground">            <div className="flex items-start gap-3">        `,

                  {selectedCenter.distance < 1000

                    ? `${selectedCenter.distance.toFixed(0)}m`              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />      })

                    : `${(selectedCenter.distance / 1000).toFixed(1)}km`}

                </p>              <div>

              </div>

            )}                <h3 className="font-semibold text-red-900 mb-2">카카오맵 로딩 실패</h3>      kakao.maps.event.addListener(marker, "click", () => {

          </div>

                <p className="text-sm text-red-800 mb-4">        infoWindowsRef.current.forEach((iw) => iw.close())

          <div className="mt-6 pt-6 border-t border-border">

            <Button                  카카오맵 SDK를 로드할 수 없습니다. 목록 보기를 사용해주세요.        infoWindow.open(map, marker)

              className="w-full bg-oot-sky-accent text-white hover:bg-sky-600"

              onClick={() => {                </p>        setSelectedCenter(center)

                const url = `https://map.kakao.com/link/map/${selectedCenter.name},${selectedCenter.latitude},${selectedCenter.longitude}`

                window.open(url, "_blank")                <Button       })

              }}

            >                  onClick={() => setUseMapView(false)}

              카카오맵에서 보기

            </Button>                  className="bg-red-600 hover:bg-red-700 text-white"      markersRef.current.push(marker)

          </div>

        </Card>                >      infoWindowsRef.current.push(infoWindow)

      )}

    </div>                  목록 보기로 전환    })

  )

}                </Button>  }


              </div>

            </div>  const handleSearch = async () => {

          </Card>    if (!userLocation) {

        </div>      setError("위치 정보를 가져올 수 없습니다.")

      )}      return

    }

      <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>

        <div className="mb-8">    setIsLoading(true)

          <h1 className="text-3xl font-bold text-foreground mb-2">근처 기부처 찾기</h1>    setError(undefined)

          <p className="text-muted-foreground">

            카카오맵으로 주변 기부처를 쉽게 찾아보세요    try {

          </p>      const result = await searchDonationCenters(

        </div>        userLocation.lat,

        userLocation.lng,

        <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mb-8")}>        5000,

          <div className="flex gap-3 mb-4">        searchKeyword || undefined

            <input      )

              type="text"

              placeholder="검색 키워드 입력 (예: 의류기부, 헌옷수거함)"      if ("data" in result) {

              value={searchKeyword}        setCenters(result.data)

              onChange={(e) => setSearchKeyword(e.target.value)}        if (mapRef.current) {

              onKeyDown={(e) => e.key === "Enter" && handleSearch()}          addMarkers(mapRef.current, result.data)

              className={cn(STYLE_CONSTANTS.FORM.INPUT, "flex-1")}        }

              aria-label="기부처 검색 키워드"      } else {

            />        setError((result as any).message || "검색에 실패했습니다.")

            <Button      }

              onClick={handleSearch}    } catch (err) {

              className="bg-oot-sky-accent text-white hover:bg-sky-600"      console.error(err)

              disabled={isLoading}      setError("검색 중 오류가 발생했습니다.")

              aria-label="검색"    } finally {

            >      setIsLoading(false)

              {isLoading ? "검색 중..." : "검색"}    }

            </Button>  }

          </div>

  return (

          {kakaoLoaded && (    <LoadingState isLoading={isLoading} error={error}>

            <div className="flex gap-2">      {kakaoError && (

              <Button        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>

                variant={useMapView ? "default" : "outline"}          <Card className="border-red-300 bg-red-50 p-6">

                size="sm"            <div className="flex items-start gap-3">

                onClick={() => setUseMapView(true)}              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />

                className={useMapView ? "bg-oot-sky-accent text-white" : ""}              <div>

              >                <h3 className="font-semibold text-red-900 mb-2">카카오맵 로딩 실패</h3>

                🗺️ 지도 보기                <p className="text-sm text-red-800 mb-4">

              </Button>                  카카오맵 SDK를 로드할 수 없습니다. 목록 보기를 사용해주세요.

              <Button                </p>

                variant={!useMapView ? "default" : "outline"}                <Button 

                size="sm"                  onClick={() => setUseMapView(false)}

                onClick={() => setUseMapView(false)}                  className="bg-red-600 hover:bg-red-700 text-white"

                className={!useMapView ? "bg-oot-sky-accent text-white" : ""}                >

              >                  목록 보기로 전환

                📋 목록 보기                </Button>

              </Button>              </div>

            </div>            </div>

          )}          </Card>

        </Card>        </div>

      )}

        <div className={useMapView && kakaoLoaded ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : ""}>        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>

          {useMapView && kakaoLoaded && (        <div className="mb-8">

            <div className="lg:col-span-2">          <h1 className="text-3xl font-bold text-foreground mb-2">근처 기부처 찾기</h1>

              <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, "overflow-hidden p-0")}>          <p className="text-muted-foreground">

                <div            카카오맵으로 주변 기부처를 쉽게 찾아보세요

                  ref={mapContainer}          </p>

                  className="w-full h-[600px] bg-muted"        </div>

                  style={{ minHeight: "600px" }}

                  aria-label="카카오맵 기부처 검색"        {/* 검색 섹션 */}

                />        <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mb-8")}>

              </Card>          <div className="flex gap-3">

            </div>            <input

          )}              type="text"

              placeholder="검색 키워드 입력 (예: 의류기부, 헌옷수거함)"

          <div className={useMapView && kakaoLoaded ? "" : cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-4")}>              value={searchKeyword}

            <div className="mb-4">              onChange={(e) => setSearchKeyword(e.target.value)}

              <h2 className="text-lg font-semibold text-foreground">              onKeyDown={(e) => e.key === "Enter" && handleSearch()}

                기부처 목록 ({centers.length})              className={cn(

              </h2>                STYLE_CONSTANTS.FORM.INPUT,

            </div>                "flex-1"

              )}

            <div className={cn(STYLE_CONSTANTS.SPACING.SM, "space-y-3")}>              aria-label="기부처 검색 키워드"

              {centers.map((center) => (            />

                <Card            <Button

                  key={center.donationCenterId}              onClick={handleSearch}

                  className={cn(              className="bg-sky-600 text-white hover:bg-sky-700"

                    STYLE_CONSTANTS.CARD.HOVER,              disabled={isLoading}

                    STYLE_CONSTANTS.PADDING.MD,              aria-label="검색"

                    "cursor-pointer transition-all",            >

                    selectedCenter?.donationCenterId === center.donationCenterId              {isLoading ? "검색 중..." : "검색"}

                      ? "ring-2 ring-oot-sky-accent bg-oot-sky-50"            </Button>

                      : ""          </div>

                  )}        </Card>

                  onClick={() => setSelectedCenter(center)}

                  role="button"        {/* 지도와 목록 */}

                  tabIndex={0}        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  onKeyDown={(e) => {          {/* 지도 */}

                    if (e.key === "Enter" || e.key === " ") {          <div className="lg:col-span-2">

                      setSelectedCenter(center)            <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, "overflow-hidden p-0")}>

                    }              <div

                  }}                ref={mapContainer}

                  aria-label={`${center.name} 선택`}                className="w-full h-[600px] bg-muted"

                >                style={{ minHeight: "600px" }}

                  <div className="space-y-2">                aria-label="카카오맵 기부처 검색"

                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">              />

                      {center.name}            </Card>

                    </h3>          </div>



                    <div className="flex items-start gap-2 text-xs text-muted-foreground">          {/* 목록 */}

                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />          <div>

                      <span className="line-clamp-2">{center.address}</span>            <div className="mb-4">

                    </div>              <h2 className="text-lg font-semibold text-foreground">

                기부처 목록 ({centers.length})

                    {center.phoneNumber && (              </h2>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">            </div>

                        <Phone className="h-4 w-4 flex-shrink-0" />

                        <a            <div className={cn(STYLE_CONSTANTS.SPACING.SM, "space-y-3")}>

                          href={`tel:${center.phoneNumber}`}              {centers.map((center) => (

                          className="hover:text-oot-sky-accent underline"                <Card

                          aria-label={`${center.name}에 전화 걸기`}                  key={center.donationCenterId}

                        >                  className={cn(

                          {center.phoneNumber}                    STYLE_CONSTANTS.CARD.HOVER,

                        </a>                    STYLE_CONSTANTS.PADDING.MD,

                      </div>                    "cursor-pointer transition-all",

                    )}                    selectedCenter?.donationCenterId === center.donationCenterId

                      ? "ring-2 ring-sky-600 bg-sky-50"

                    {center.operatingHours && (                      : ""

                      <div className="flex items-start gap-2 text-xs text-muted-foreground">                  )}

                        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />                  onClick={() => setSelectedCenter(center)}

                        <span>{center.operatingHours}</span>                  role="button"

                      </div>                  tabIndex={0}

                    )}                  onKeyDown={(e) => {

                    if (e.key === "Enter" || e.key === " ") {

                    {center.distance !== null && center.distance !== undefined && (                      setSelectedCenter(center)

                      <div className="pt-2 border-t border-border">                    }

                        <span className="text-xs font-semibold text-oot-sky-accent">                  }}

                          📍 {center.distance.toFixed(0)}m                  aria-label={`${center.name} 선택`}

                        </span>                >

                      </div>                  <div className="space-y-2">

                    )}                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">

                  </div>                      {center.name}

                </Card>                    </h3>

              ))}

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">

              {centers.length === 0 && (                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />

                <div className="text-center py-8">                      <span className="line-clamp-2">{center.address}</span>

                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />                    </div>

                  <p className="text-sm text-muted-foreground">

                    검색 결과가 없습니다.                    {center.phoneNumber && (

                  </p>                      <div className="flex items-center gap-2 text-xs text-muted-foreground">

                  <p className="text-xs text-muted-foreground mt-1">                        <Phone className="h-4 w-4 flex-shrink-0" />

                    다른 키워드로 검색해보세요.                        <a

                  </p>                          href={`tel:${center.phoneNumber}`}

                </div>                          className="hover:text-sky-600 underline"

              )}                          aria-label={`${center.name}에 전화 걸기`}

            </div>                        >

          </div>                          {center.phoneNumber}

        </div>                        </a>

                      </div>

        {selectedCenter && (                    )}

          <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mt-8")}>

            <h2 className="text-xl font-bold text-foreground mb-4">{selectedCenter.name}</h2>                    {center.operatingHours && (

                      <div className="flex items-start gap-2 text-xs text-muted-foreground">

            <div className={STYLE_CONSTANTS.SPACING.SM}>                        <Clock className="h-4 w-4 flex-shrink-0 mt-0.5" />

              <div>                        <span>{center.operatingHours}</span>

                <span className="text-sm font-medium text-muted-foreground">주소</span>                      </div>

                <p className="text-sm text-foreground">{selectedCenter.address}</p>                    )}

              </div>

                    {center.distance !== null && center.distance !== undefined && (

              {selectedCenter.phoneNumber && (                      <div className="pt-2 border-t border-border">

                <div>                        <span className="text-xs font-semibold text-sky-600">

                  <span className="text-sm font-medium text-muted-foreground">전화번호</span>                          📍 {center.distance.toFixed(0)}m

                  <a                        </span>

                    href={`tel:${selectedCenter.phoneNumber}`}                      </div>

                    className="text-sm text-oot-sky-accent hover:underline"                    )}

                  >                  </div>

                    {selectedCenter.phoneNumber}                </Card>

                  </a>              ))}

                </div>

              )}              {centers.length === 0 && (

                <div className="text-center py-8">

              {selectedCenter.operatingHours && (                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />

                <div>                  <p className="text-sm text-muted-foreground">

                  <span className="text-sm font-medium text-muted-foreground">운영시간</span>                    검색 결과가 없습니다.

                  <p className="text-sm text-foreground">{selectedCenter.operatingHours}</p>                  </p>

                </div>                  <p className="text-xs text-muted-foreground mt-1">

              )}                    다른 키워드로 검색해보세요.

                  </p>

              {selectedCenter.description && (                </div>

                <div>              )}

                  <span className="text-sm font-medium text-muted-foreground">설명</span>            </div>

                  <p className="text-sm text-foreground">{selectedCenter.description}</p>          </div>

                </div>        </div>

              )}

        {/* 상세 정보 */}

              {selectedCenter.distance !== null && selectedCenter.distance !== undefined && (        {selectedCenter && (

                <div>          <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mt-8")}>

                  <span className="text-sm font-medium text-muted-foreground">현재 위치로부터</span>            <h2 className="text-xl font-bold text-foreground mb-4">{selectedCenter.name}</h2>

                  <p className="text-sm text-foreground">

                    {selectedCenter.distance < 1000            <div className={STYLE_CONSTANTS.SPACING.SM}>

                      ? `${selectedCenter.distance.toFixed(0)}m`              <div>

                      : `${(selectedCenter.distance / 1000).toFixed(1)}km`}                <span className="text-sm font-medium text-muted-foreground">주소</span>

                  </p>                <p className="text-sm text-foreground">{selectedCenter.address}</p>

                </div>              </div>

              )}

            </div>              {selectedCenter.phoneNumber && (

                <div>

            <div className="mt-6 pt-6 border-t border-border">                  <span className="text-sm font-medium text-muted-foreground">전화번호</span>

              <Button                  <a

                className="w-full bg-oot-sky-accent text-white hover:bg-sky-600"                    href={`tel:${selectedCenter.phoneNumber}`}

                onClick={() => {                    className="text-sm text-sky-600 hover:underline"

                  const url = `https://map.kakao.com/link/map/${selectedCenter.name},${selectedCenter.latitude},${selectedCenter.longitude}`                  >

                  window.open(url, "_blank")                    {selectedCenter.phoneNumber}

                }}                  </a>

              >                </div>

                카카오맵에서 보기              )}

              </Button>

            </div>              {selectedCenter.operatingHours && (

          </Card>                <div>

        )}                  <span className="text-sm font-medium text-muted-foreground">운영시간</span>

      </div>                  <p className="text-sm text-foreground">{selectedCenter.operatingHours}</p>

    </LoadingState>                </div>

  )              )}

}

              {selectedCenter.description && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">설명</span>
                  <p className="text-sm text-foreground">{selectedCenter.description}</p>
                </div>
              )}

              {selectedCenter.distance !== null && selectedCenter.distance !== undefined && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">현재 위치로부터</span>
                  <p className="text-sm text-foreground">
                    {selectedCenter.distance < 1000
                      ? `${selectedCenter.distance.toFixed(0)}m`
                      : `${(selectedCenter.distance / 1000).toFixed(1)}km`}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <Button
                className="w-full bg-sky-600 text-white hover:bg-sky-700"
                onClick={() => {
                  const url = `https://map.kakao.com/link/map/${selectedCenter.name},${selectedCenter.latitude},${selectedCenter.longitude}`
                  window.open(url, "_blank")
                }}
              >
                카카오맵에서 보기
              </Button>
            </div>
          </Card>
        </div>
      )}

      {!kakaoError && (