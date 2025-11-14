"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  AlertCircle,
  Clock,
  Info,
  List,
  Map,
  MapPin,
  Phone,
  RefreshCw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LoadingState } from "@/components/ui/loading-state"
import { STYLE_CONSTANTS } from "@/lib/constants/styles"
import { useKakaoMaps } from "@/hooks/useKakaoMaps"
import { searchDonationCenters } from "@/lib/api/donation"
import type { DonationCenter } from "@/lib/types/donation"
import { cn } from "@/lib/utils"

const DEFAULT_LOCATION = { lat: 37.5665, lng: 126.978 } // 서울 시청 좌표

const MOCK_DONATION_CENTERS: DonationCenter[] = [
  {
    donationCenterId: 1,
    kakaoPlaceId: "123456",
    name: "서울 기부센터",
    address: "서울특별시 중구 세종대로 110",
    phoneNumber: "02-1234-5678",
    operatingHours: "09:00 ~ 18:00",
    latitude: 37.5665,
    longitude: 126.978,
    description: "의류와 일상 용품을 기부 받을 수 있는 공식 센터입니다.",
    distance: 250,
  },
  {
    donationCenterId: 2,
    kakaoPlaceId: "789101",
    name: "강남 나눔터",
    address: "서울특별시 강남구 테헤란로 427",
    phoneNumber: "02-8765-4321",
    operatingHours: "10:00 ~ 19:00",
    latitude: 37.5053,
    longitude: 127.0497,
    description: "주말에도 운영되는 강남 지역 기부 거점입니다.",
    distance: 1420,
  },
  {
    donationCenterId: 3,
    kakaoPlaceId: "112233",
    name: "마포 나눔의 집",
    address: "서울특별시 마포구 월드컵북로 400",
    phoneNumber: null,
    operatingHours: "09:30 ~ 17:30",
    latitude: 37.5663,
    longitude: 126.9014,
    description: "기부 물품을 즉시 분류하여 필요한 가정에 전달합니다.",
    distance: 3270,
  },
]

function formatDistance(distance: number) {
  if (!Number.isFinite(distance)) return "-"
  if (distance < 1000) return `${Math.round(distance)}m`
  return `${(distance / 1000).toFixed(1)}km`
}

export default function DonationCenterList() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const infoWindowsRef = useRef<any[]>([])

  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [activeKeyword, setActiveKeyword] = useState("")
  const [useMapView, setUseMapView] = useState(true)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const {
    kakao,
    isLoaded: kakaoLoaded,
    error: kakaoError,
    reload: reloadKakaoMaps,
  } = useKakaoMaps({ autoLoad: true })

  const clearMapArtifacts = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []
    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())
    infoWindowsRef.current = []
  }, [])

  const fetchDonationCenters = useCallback(async () => {
    if (!userLocation) return

    setIsLoading(true)
    setError(null)

    try {
      // 토큰이 있으면 전달 (없어도 시도)
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
      
      const response = await searchDonationCenters(
        userLocation.lat,
        userLocation.lng,
        3000,
        activeKeyword || undefined,
        token || undefined
      )

      if (response?.data?.length) {
        setCenters(response.data)
      } else {
        // 목 데이터 사용 시 클라이언트 사이드 필터링
        let filteredCenters = MOCK_DONATION_CENTERS
        if (activeKeyword) {
          const keyword = activeKeyword.toLowerCase()
          filteredCenters = MOCK_DONATION_CENTERS.filter(
            (center) =>
              center.name.toLowerCase().includes(keyword) ||
              center.address.toLowerCase().includes(keyword) ||
              center.description?.toLowerCase().includes(keyword)
          )
        }
        setCenters(filteredCenters)
      }
    } catch (fetchError) {
      console.error("❌ Failed to fetch donation centers:", fetchError)
      setError("기부센터 정보를 불러오는 데 실패했습니다. 목 데이터를 표시합니다.")
      
      // 에러 시에도 필터링된 목 데이터 표시
      let filteredCenters = MOCK_DONATION_CENTERS
      if (activeKeyword) {
        const keyword = activeKeyword.toLowerCase()
        filteredCenters = MOCK_DONATION_CENTERS.filter(
          (center) =>
            center.name.toLowerCase().includes(keyword) ||
            center.address.toLowerCase().includes(keyword) ||
            center.description?.toLowerCase().includes(keyword)
        )
      }
      setCenters(filteredCenters)
    } finally {
      setIsLoading(false)
    }
  }, [activeKeyword, userLocation])

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(DEFAULT_LOCATION)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => setUserLocation(DEFAULT_LOCATION),
      { timeout: 5000 }
    )
  }, [])

  useEffect(() => {
    if (!userLocation) return
    void fetchDonationCenters()
  }, [fetchDonationCenters, userLocation])

  useEffect(() => {
    if (!useMapView) {
      clearMapArtifacts()
      mapRef.current = null
      return
    }

    if (!kakaoLoaded || !kakao || !mapContainerRef.current || !userLocation) {
      return
    }

    // autoload=false 모드이므로 kakao.maps.load()를 명시적으로 호출
    console.log("🚀 Initializing Kakao Maps with kakao.maps.load()...")

    // kakao.maps.load() 콜백으로 지도 초기화
    // window.kakao를 직접 참조하여 스코프 문제 해결
    const windowKakao = (window as any).kakao
    if (!windowKakao?.maps?.load) {
      console.error("❌ kakao.maps.load() function not available")
      return
    }

    windowKakao.maps.load(() => {
      console.log("✅ kakao.maps.load() callback executed")
      
      // 콜백 내부에서 window.kakao를 다시 참조
      const kakaoInCallback = (window as any).kakao
      console.log("🔍 Checking API availability:", {
        LatLng: typeof kakaoInCallback?.maps?.LatLng,
        Map: typeof kakaoInCallback?.maps?.Map,
        Marker: typeof kakaoInCallback?.maps?.Marker,
      })

      // 여전히 로드되지 않았으면 종료
      if (typeof kakaoInCallback?.maps?.LatLng !== "function") {
        console.error("❌ Kakao Maps API still not ready after load callback")
        return
      }

      // 지도 초기화
      try {
        if (!mapContainerRef.current) return

        const kakaoLatLng = new kakaoInCallback.maps.LatLng(userLocation.lat, userLocation.lng)

        if (!mapRef.current) {
          mapRef.current = new kakaoInCallback.maps.Map(mapContainerRef.current, {
            center: kakaoLatLng,
            level: 5,
          })
          console.log("✅ Map initialized successfully")
        } else {
          mapRef.current.setCenter(kakaoLatLng)
        }

        clearMapArtifacts()

        if (!centers.length) {
          console.log("ℹ️ No donation centers to display")
          return
        }

        const bounds = new kakaoInCallback.maps.LatLngBounds()

        centers.forEach((center) => {
          const position = new kakaoInCallback.maps.LatLng(center.latitude, center.longitude)
          const marker = new kakaoInCallback.maps.Marker({
            position,
            map: mapRef.current,
            title: center.name,
          })

          const infoWindow = new kakaoInCallback.maps.InfoWindow({
          content: `
            <div style="padding:8px 12px;line-height:1.4;">
              <strong>${center.name}</strong><br/>
              <span style="font-size:12px;color:#666;">${center.address}</span>
            </div>
          `,
        })

        kakao.maps.event.addListener(marker, "click", () => {
          infoWindowsRef.current.forEach((info) => info.close())
          infoWindow.open(mapRef.current, marker)
        })

        markersRef.current.push(marker)
        infoWindowsRef.current.push(infoWindow)
        bounds.extend(position)
      })

      if (!bounds.isEmpty && typeof bounds.isEmpty === "function") {
        if (!bounds.isEmpty()) {
          mapRef.current.setBounds(bounds)
        }
      } else {
        mapRef.current.setBounds(bounds)
      }

      console.log(`✅ ${centers.length} markers added to map`)
      } catch (error) {
        console.error("❌ Map initialization failed:", error)
      }
    })
  }, [centers, clearMapArtifacts, kakao, kakaoLoaded, useMapView, userLocation])

  useEffect(() => {
    return () => {
      clearMapArtifacts()
      mapRef.current = null
    }
  }, [clearMapArtifacts])

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveKeyword(searchKeyword.trim())
  }

  const handleReset = () => {
    setSearchKeyword("")
    setActiveKeyword("")
  }

  const combinedError = error ?? undefined

  return (
    <section className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-10 space-y-8")}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">주변 기부 센터 찾기</h1>
          <p className="text-muted-foreground">
            내 위치 기준으로 가까운 의류 기부 센터를 검색하고 지도에서 확인하세요.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={useMapView ? "default" : "outline"}
            size="sm"
            onClick={() => setUseMapView(true)}
          >
            <Map className="h-4 w-4" />
            지도 보기
          </Button>
          <Button
            variant={!useMapView ? "default" : "outline"}
            size="sm"
            onClick={() => setUseMapView(false)}
          >
            <List className="h-4 w-4" />
            리스트 보기
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 rounded-2xl border bg-card/60 p-4 shadow-sm md:flex-row md:items-center"
      >
        <div className="flex-1">
          <Input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            placeholder="지역명, 센터명 또는 키워드를 입력하세요"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">검색</Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            초기화
          </Button>
        </div>
      </form>

      {useMapView && (
        <div className="h-[440px] w-full overflow-hidden rounded-2xl border bg-muted/30">
          {kakaoLoaded && !kakaoError ? (
            <div ref={mapContainerRef} className="h-full w-full" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <AlertCircle className="h-6 w-6" />
              <p>
                {kakaoError
                  ? "카카오맵을 불러오는 중 문제가 발생했습니다."
                  : "카카오맵을 불러오는 중입니다..."}
              </p>
              {kakaoError && (
                <Button variant="outline" size="sm" onClick={() => void reloadKakaoMaps()}>
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      <LoadingState
        isLoading={isLoading}
        error={combinedError}
        onRetry={() => void fetchDonationCenters()}
      >
        <div className={cn(STYLE_CONSTANTS.GRID.COLS_2, "lg:grid-cols-3")}>
          {centers.map((center) => (
            <Card key={center.donationCenterId}>
              <CardHeader className="gap-1">
                <CardTitle className="text-lg">{center.name}</CardTitle>
                <CardDescription className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{center.address}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{center.phoneNumber ?? "연락처 정보 없음"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{center.operatingHours ?? "운영 시간 정보 없음"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <span className="text-foreground">{center.description}</span>
                </div>
                <div className="flex items-center gap-2 text-primary">
                  <MapPin className="h-4 w-4" />
                  <span>현재 위치에서 {formatDistance(center.distance)} 거리</span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <a
                    href={`https://map.kakao.com/link/to/${encodeURIComponent(center.name)},${center.latitude},${center.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    길찾기
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </LoadingState>
    </section>
  )
}
