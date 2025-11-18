"use client"
import { getMyInfo } from "@/lib/api/user"
import { useEffect, useState } from "react"

export default function MyPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 카카오맵 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 거래 희망 좌표 지도 렌더링
  useEffect(() => {
    if (!profile?.tradeLatitude || !profile?.tradeLongitude) return;
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => {
        const container = document.getElementById("my-map");
        if (!container) return;
        const options = {
          center: new window.kakao.maps.LatLng(profile.tradeLatitude, profile.tradeLongitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(profile.tradeLatitude, profile.tradeLongitude),
        });
        marker.setMap(map);
      });
    }
  }, [profile?.tradeLatitude, profile?.tradeLongitude]);

  // 예시: 최소한의 UI 복구 (실제 UI는 이전 코드 참고)
  return (
    <div>
      <h1>마이페이지</h1>
      {profile?.tradeAddress && (
        <div>
          <p>거래 희망 지역: {profile.tradeAddress}</p>
          <div id="my-map" style={{ width: "100%", height: "300px", border: "1px solid #eee" }} />
        </div>
      )}
    </div>
  );
}