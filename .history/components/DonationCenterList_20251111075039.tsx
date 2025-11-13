"use client"

import { useEffect, useState, useRef } from "react"
import { searchDonationCenters } from "@/lib/api/donation"
import { useKakaoMaps } from "@/hooks/useKakaoMaps"
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

  // 새로운 Kakao Maps 훅 사용
  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({
    autoLoad: true,
    onError: (error) => {
      console.error("❌ Kakao Maps loading failed:", error)
      setError("카카오맵을 불러올 수 없습니다. 나중에 다시 시도해주세요.")
    },
  })

  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [useMapView, setUseMapView] = useState(true) // 지도 보기/목록 보기 토글

  // 마운트 상태 확인
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 사용자 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setUserLocation({ lat: 37.5665, lng: 126.978 }) // 서울 기본 좌표
        }
      )
    }
  }, [])

  // 카카오맵 초기화
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

        console.log("✅ 카카오맵 API 키 확인됨:", apiKey.substring(0, 10) + "...")

        // 이미 로드된 경우
        const kakao = (window as any).kakao
        if (kakao && kakao.maps) {
          console.log("✅ 카카오맵이 이미 로드되어 있습니다.")
          setTimeout(() => initMap(), 100)
          return
        }

        // 스크립트 로드
        return new Promise((resolve, reject) => {
          const script = document.createElement("script")
          script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services,clusterer,drawing`
          script.async = true
          script.defer = true
          
          script.onload = () => {
            console.log("✅ 카카오맵 SDK 스크립트 로드 성공")
            setTimeout(() => {
              try {
                initMap()
                resolve(true)
              } catch (err) {
                console.error("❌ 지도 초기화 오류:", err)
                reject(err)
              }
            }, 300)
          }
          
          script.onerror = (error) => {
            console.error("❌ 카카오맵 SDK 로드 실패:", error)
            setError("카카오맵 SDK를 불러올 수 없습니다.")
            reject(error)
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
    if (!mapContainer.current || !userLocation) {
      console.warn("Map container or location not ready")
      return
    }

    try {
      const kakao = (window as any).kakao
      if (!kakao || !kakao.maps) {
        console.error("Kakao maps not loaded")
        setError("카카오맵을 불러올 수 없습니다.")
        return
      }

      const mapOptions = {
        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        level: 5,
      }

      const map = new kakao.maps.Map(mapContainer.current, mapOptions)
      mapRef.current = map

      // 사용자 위치 마커
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

      // 기부처 마커 표시
      addMarkers(map, centers)
    } catch (err) {
      console.error("Map initialization error:", err)
      setError("지도를 초기화할 수 없습니다.")
    }
  }

  const addMarkers = (map: any, centersList: DonationCenter[]) => {
    const kakao = (window as any).kakao
    if (!kakao) return

    // 기존 마커와 인포윈도우 제거
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
      const result = await searchDonationCenters(
        userLocation.lat,
        userLocation.lng,
        5000,
        searchKeyword || undefined
      )

      if ("data" in result) {
        setCenters(result.data)
        if (mapRef.current) {
          addMarkers(mapRef.current, result.data)
        }
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
      {!isMounted ? (
        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      ) : (
        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">근처 기부처 찾기</h1>
          <p className="text-muted-foreground">
            카카오맵으로 주변 기부처를 쉽게 찾아보세요
          </p>
        </div>

        {/* 검색 섹션 */}
        <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, STYLE_CONSTANTS.PADDING.MD, "mb-8")}>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="검색 키워드 입력 (예: 의류기부, 헌옷수거함)"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className={cn(
                STYLE_CONSTANTS.FORM.INPUT,
                "flex-1"
              )}
              aria-label="기부처 검색 키워드"
            />
            <Button
              onClick={handleSearch}
              className="bg-sky-600 text-white hover:bg-sky-700"
              disabled={isLoading}
              aria-label="검색"
            >
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </div>
        </Card>

        {/* 지도와 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 지도 */}
          <div className="lg:col-span-2">
            <Card className={cn(STYLE_CONSTANTS.CARD.DEFAULT, "overflow-hidden p-0")}>
              <div
                ref={mapContainer}
                className="w-full h-[600px] bg-muted"
                style={{ minHeight: "600px" }}
                aria-label="카카오맵 기부처 검색"
              />
            </Card>
          </div>

          {/* 목록 */}
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                기부처 목록 ({centers.length})
              </h2>
            </div>

            <div className={cn(STYLE_CONSTANTS.SPACING.SM, "space-y-3")}>
              {centers.map((center) => (
                <Card
                  key={center.donationCenterId}
                  className={cn(
                    STYLE_CONSTANTS.CARD.HOVER,
                    STYLE_CONSTANTS.PADDING.MD,
                    "cursor-pointer transition-all",
                    selectedCenter?.donationCenterId === center.donationCenterId
                      ? "ring-2 ring-sky-600 bg-sky-50"
                      : ""
                  )}
                  onClick={() => setSelectedCenter(center)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedCenter(center)
                    }
                  }}
                  aria-label={`${center.name} 선택`}
                >
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-foreground line-clamp-2">
                      {center.name}
                    </h3>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{center.address}</span>
                    </div>

                    {center.phoneNumber && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <a
                          href={`tel:${center.phoneNumber}`}
                          className="hover:text-sky-600 underline"
                          aria-label={`${center.name}에 전화 걸기`}
                        >
                          {center.phoneNumber}
                        </a>
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
                        <span className="text-xs font-semibold text-sky-600">
                          📍 {center.distance.toFixed(0)}m
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {centers.length === 0 && (
                <div className="text-center py-8">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    검색 결과가 없습니다.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    다른 키워드로 검색해보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 상세 정보 */}
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
                  <a
                    href={`tel:${selectedCenter.phoneNumber}`}
                    className="text-sm text-sky-600 hover:underline"
                  >
                    {selectedCenter.phoneNumber}
                  </a>
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
        )}
        </div>
      )}
    </LoadingState>
  )
}