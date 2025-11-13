"use client""use client"



import { useEffect, useState, useRef } from "react"import { useEffect, useState, useRef } from "react"

import { searchDonationCenters } from "@/lib/api/donation"import { searchDonationCenters } from "@/lib/api/donation"

import { useKakaoMaps } from "@/hooks/useKakaoMaps"import { useKakaoMaps } from "@/hooks/useKakaoMaps"

import type { DonationCenter } from "@/lib/types/donation"import type { DonationCenter } from "@/lib/types/donation"

import { Card } from "@/components/ui/card"import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"import { Button } from "@/components/ui/button"

import { LoadingState } from "@/components/ui/loading-state"import { LoadingState } from "@/components/ui/loading-state"

import { STYLE_CONSTANTS } from "@/lib/constants/styles"import { STYLE_CONSTANTS } from "@/lib/constants/styles"

import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"import { MapPin, Phone, Clock, Info, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"import { cn } from "@/lib/utils"



const MOCK_DONATION_CENTERS: DonationCenter[] = [const MOCK_DONATION_CENTERS: DonationCenter[] = [

  {  {

    donationCenterId: 1,    donationCenterId: 1,

    kakaoPlaceId: "12345678",    kakaoPlaceId: "12345678",

    name: "서울 기부센터",    name: "서울 기부센터",

    address: "서울시 강남구 테헤란로 123",    address: "서울시 강남구 테헤란로 123",

    phoneNumber: "02-1234-5678",    phoneNumber: "02-1234-5678",

    operatingHours: "09:00 ~ 18:00",    operatingHours: "09:00 ~ 18:00",

    latitude: 37.4979,    latitude: 37.4979,

    longitude: 127.0276,    longitude: 127.0276,

    distance: 250.5,    distance: 250.5,

    description: "의류 기부 전문 센터입니다.",    description: "의류 기부 전문 센터입니다.",

  },  },

  {  {

    donationCenterId: 2,    donationCenterId: 2,

    kakaoPlaceId: "87654321",    kakaoPlaceId: "87654321",

    name: "동대문 자선단체",    name: "동대문 자선단체",

    address: "서울시 동대문구 무학로 456",    address: "서울시 동대문구 무학로 456",

    phoneNumber: "02-8765-4321",    phoneNumber: "02-8765-4321",

    operatingHours: "10:00 ~ 19:00",    operatingHours: "10:00 ~ 19:00",

    latitude: 37.5745,    latitude: 37.5745,

    longitude: 127.0086,    longitude: 127.0086,

    distance: 1250.3,    distance: 1250.3,

    description: "다양한 기부를 받고 있습니다.",    description: "다양한 기부를 받고 있습니다.",

  },  },

  {  {

    donationCenterId: 3,    donationCenterId: 3,

    kakaoPlaceId: "11111111",    kakaoPlaceId: "11111111",

    name: "강북 나눔터",    name: "강북 나눔터",

    address: "서울시 강북구 삼양로 789",    address: "서울시 강북구 삼양로 789",

    phoneNumber: null,    phoneNumber: null,

    operatingHours: "09:00 ~ 17:00",    operatingHours: "09:00 ~ 17:00",

    latitude: 37.6386,    latitude: 37.6386,

    longitude: 127.0096,    longitude: 127.0096,

    distance: 2100.0,    distance: 2100.0,

    description: "의류와 물품을 기부받습니다.",    description: "의류와 물품을 기부받습니다.",

  },  },

]]



export default function DonationCenterList() {export default function DonationCenterList() {

  const mapContainer = useRef<HTMLDivElement>(null)  const mapContainer = useRef<HTMLDivElement>(null)

  const mapRef = useRef<any>(null)  const mapRef = useRef<any>(null)

  const markersRef = useRef<any[]>([])  const markersRef = useRef<any[]>([])

  const infoWindowsRef = useRef<any[]>([])  const infoWindowsRef = useRef<any[]>([])



  // 새로운 Kakao Maps 훅 사용 (싱글톤 패턴)  // 새로운 Kakao Maps 훅 사용

  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({  const { isLoaded: kakaoLoaded, error: kakaoError, kakao } = useKakaoMaps({

    autoLoad: true,    autoLoad: true,

    onError: (error) => {    onError: (error) => {

      console.error("❌ Kakao Maps loading failed:", error)      console.error("❌ Kakao Maps loading failed:", error)

      setUseMapView(false)      setError("카카오맵을 불러올 수 없습니다. 나중에 다시 시도해주세요.")

    },    },

  })  })



  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)  const [centers, setCenters] = useState<DonationCenter[]>(MOCK_DONATION_CENTERS)

  const [isLoading, setIsLoading] = useState(false)  const [isLoading, setIsLoading] = useState(false)

  const [error, setError] = useState<string | undefined>()  const [error, setError] = useState<string | undefined>()

  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)

  const [searchKeyword, setSearchKeyword] = useState("")  const [searchKeyword, setSearchKeyword] = useState("")

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const [useMapView, setUseMapView] = useState(true)  const [useMapView, setUseMapView] = useState(true) // 지도 보기/목록 보기 토글



  // 사용자 위치 가져오기  // 마운트 상태 확인

  useEffect(() => {  useEffect(() => {

    if (navigator.geolocation) {    // 클라이언트 사이드에서만 실행

      navigator.geolocation.getCurrentPosition(  }, [])

        (position) => {

          setUserLocation({  // 사용자 위치 가져오기

            lat: position.coords.latitude,  useEffect(() => {

            lng: position.coords.longitude,    if (navigator.geolocation) {

          })      navigator.geolocation.getCurrentPosition(

        },        (position) => {

        () => {          setUserLocation({

          setUserLocation({ lat: 37.5665, lng: 126.978 })            lat: position.coords.latitude,

        }            lng: position.coords.longitude,

      )          })

    }        },

  }, [])        () => {

          setUserLocation({ lat: 37.5665, lng: 126.978 }) // 서울 기본 좌표

  // 카카오맵 초기화        }

  useEffect(() => {      )

    if (!userLocation || !mapContainer.current || !kakaoLoaded || !useMapView) return    }

  }, [])

    try {

      if (!kakao || !kakao.maps) {  // 카카오맵 초기화

        setError("카카오맵을 불러올 수 없습니다.")  useEffect(() => {

        setUseMapView(false)    if (!userLocation || !mapContainer.current || !kakaoLoaded) return

        return

      }    try {

      if (!kakao || !kakao.maps) {

      const mapOptions = {        setError("카카오맵을 불러올 수 없습니다.")

        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),        setUseMapView(false)

        level: 5,        return

      }      }



      const map = new kakao.maps.Map(mapContainer.current, mapOptions)      const mapOptions = {

      mapRef.current = map        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

        level: 5,

      const userMarker = new kakao.maps.Marker({      }

        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

        title: "내 위치",      const map = new kakao.maps.Map(mapContainer.current, mapOptions)

        image: new kakao.maps.MarkerImage(      mapRef.current = map

          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

          new kakao.maps.Size(24, 35),      // 사용자 위치 마커

          { offset: new kakao.maps.Point(12, 35) }      const userMarker = new kakao.maps.Marker({

        ),        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

      })        title: "내 위치",

      userMarker.setMap(map)        image: new kakao.maps.MarkerImage(

          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

      addMarkers(map, centers)          new kakao.maps.Size(24, 35),

      console.log("✅ Kakao Map initialized successfully")          { offset: new kakao.maps.Point(12, 35) }

    } catch (err) {        ),

      console.error("❌ Map initialization error:", err)      })

      setError("지도를 초기화할 수 없습니다.")      userMarker.setMap(map)

      setUseMapView(false)

    }      // 기부처 마커 표시

  }, [userLocation, kakaoLoaded, kakao, centers, useMapView])      addMarkers(map, centers)

      

  const addMarkers = (map: any, centersList: DonationCenter[]) => {      console.log("✅ Kakao Map initialized successfully")

    if (!kakao) return    } catch (err) {

      console.error("❌ Map initialization error:", err)

    markersRef.current.forEach((marker) => marker.setMap(null))      setError("지도를 초기화할 수 없습니다.")

    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())      setUseMapView(false)

    markersRef.current = []    }

    infoWindowsRef.current = []  }, [userLocation, kakaoLoaded, kakao, centers])



    centersList.forEach((center) => {  const initMap = () => {

      const marker = new kakao.maps.Marker({    if (!mapContainer.current || !userLocation) {

        position: new kakao.maps.LatLng(center.latitude, center.longitude),      console.warn("Map container or location not ready")

        title: center.name,      return

      })    }

      marker.setMap(map)

    try {

      const infoWindow = new kakao.maps.InfoWindow({      const kakao = (window as any).kakao

        content: `      if (!kakao || !kakao.maps) {

          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">        console.error("Kakao maps not loaded")

            <strong style="font-size: 14px;">${center.name}</strong><br/>        setError("카카오맵을 불러올 수 없습니다.")

            <span style="color: #666;">${center.address}</span>        return

            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}      }

            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}

          </div>      const mapOptions = {

        `,        center: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

      })        level: 5,

      }

      kakao.maps.event.addListener(marker, "click", () => {

        infoWindowsRef.current.forEach((iw) => iw.close())      const map = new kakao.maps.Map(mapContainer.current, mapOptions)

        infoWindow.open(map, marker)      mapRef.current = map

        setSelectedCenter(center)

      })      // 사용자 위치 마커

      const userMarker = new kakao.maps.Marker({

      markersRef.current.push(marker)        position: new kakao.maps.LatLng(userLocation.lat, userLocation.lng),

      infoWindowsRef.current.push(infoWindow)        title: "내 위치",

    })        image: new kakao.maps.MarkerImage(

  }          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",

          new kakao.maps.Size(24, 35),

  const handleSearch = async () => {          { offset: new kakao.maps.Point(12, 35) }

    if (!userLocation) {        ),

      setError("위치 정보를 가져올 수 없습니다.")      })

      return      userMarker.setMap(map)

    }

      // 기부처 마커 표시

    setIsLoading(true)      addMarkers(map, centers)

    setError(undefined)    } catch (err) {

      console.error("Map initialization error:", err)

    try {      setError("지도를 초기화할 수 없습니다.")

      const result = await searchDonationCenters(    }

        userLocation.lat,  }

        userLocation.lng,

        5000,  const addMarkers = (map: any, centersList: DonationCenter[]) => {

        searchKeyword || undefined    const kakao = (window as any).kakao

      )    if (!kakao) return



      if ("data" in result) {    // 기존 마커와 인포윈도우 제거

        setCenters(result.data)    markersRef.current.forEach((marker) => marker.setMap(null))

        if (mapRef.current) {    infoWindowsRef.current.forEach((infoWindow) => infoWindow.close())

          addMarkers(mapRef.current, result.data)    markersRef.current = []

        }    infoWindowsRef.current = []

      } else {

        setError((result as any).message || "검색에 실패했습니다.")    centersList.forEach((center) => {

      }      const marker = new kakao.maps.Marker({

    } catch (err) {        position: new kakao.maps.LatLng(center.latitude, center.longitude),

      console.error(err)        title: center.name,

      setError("검색 중 오류가 발생했습니다.")      })

    } finally {      marker.setMap(map)

      setIsLoading(false)

    }      const infoWindow = new kakao.maps.InfoWindow({

  }        content: `

          <div style="padding: 12px; font-size: 12px; border-radius: 4px;">

  return (            <strong style="font-size: 14px;">${center.name}</strong><br/>

    <LoadingState isLoading={isLoading} error={error}>            <span style="color: #666;">${center.address}</span>

      {kakaoError && (            ${center.phoneNumber ? `<br/>📞 ${center.phoneNumber}` : ""}

        <div className={cn(STYLE_CONSTANTS.CONTAINER.DEFAULT, "py-8")}>            ${center.distance ? `<br/>📍 ${center.distance.toFixed(0)}m` : ""}

          <Card className="border-red-300 bg-red-50 p-6">          </div>

            <div className="flex items-start gap-3">        `,

              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />      })

              <div>

                <h3 className="font-semibold text-red-900 mb-2">카카오맵 로딩 실패</h3>      kakao.maps.event.addListener(marker, "click", () => {

                <p className="text-sm text-red-800 mb-4">        infoWindowsRef.current.forEach((iw) => iw.close())

                  카카오맵 SDK를 로드할 수 없습니다. 목록 보기를 사용해주세요.        infoWindow.open(map, marker)

                </p>        setSelectedCenter(center)

                <Button       })

                  onClick={() => setUseMapView(false)}

                  className="bg-red-600 hover:bg-red-700 text-white"      markersRef.current.push(marker)

                >      infoWindowsRef.current.push(infoWindow)

                  목록 보기로 전환    })

                </Button>  }

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