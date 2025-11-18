import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import KakaoMapProfile from "@/components/KakaoMapProfile"

interface MyLocationCardProps {
  address: string
  lat?: number
  lng?: number
}

export default function MyLocationCard({ address, lat, lng }: MyLocationCardProps) {
  return (
    <Card className="mt-8 p-8 flex flex-col gap-4 items-center">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-sky-500" />
        <span className="font-semibold text-lg text-gray-700">거래 희망 지역</span>
      </div>
      <div className="text-gray-900 text-base mb-2">{address}</div>
      {lat && lng && (
        <KakaoMapProfile lat={lat} lng={lng} />
      )}
    </Card>
  )
}
