import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import KakaoMapProfile from "@/components/KakaoMapProfile"

interface MyLocationCardProps {
  lat?: number
  lng?: number
}

export default function MyLocationCard({ lat, lng }: MyLocationCardProps) {
  return (
    <Card className="mt-8 p-8 flex flex-col gap-4 items-center">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-sky-500" />
        <span className="font-semibold text-lg text-gray-700">거래 희망 지역 지도</span>
      </div>
      {lat && lng && (
        <KakaoMapProfile lat={lat} lng={lng} />
      )}
    </Card>
  )
}
