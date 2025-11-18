import Script from "next/script"
import { useEffect, useRef } from "react"

interface KakaoMapProps {
  lat: number
  lng: number
}

export default function KakaoMap({ lat, lng }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapRef.current) {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(lat, lng),
        level: 3,
      })
      new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(lat, lng),
        map,
      })
    }
  }, [lat, lng])

  return (
    <>
      <Script src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY}&autoload=false`} strategy="beforeInteractive" onLoad={() => { window.kakao.maps.load(() => {}) }} />
      <div ref={mapRef} style={{ width: "100%", height: "240px", borderRadius: "1rem", boxShadow: "0 2px 8px #e0e7ef" }} />
    </>
  )
}
