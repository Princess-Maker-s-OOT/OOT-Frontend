import { MOCK_CLOSETS } from "@/lib/mocks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MyCloset() {
  const closets = MOCK_CLOSETS

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">내 옷장 관리</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          옷장 만들기
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {closets.map((closet) => (
          <Card key={closet.closetId} className="p-4">
            <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
              <img
                src={closet.imageUrl ?? "https://via.placeholder.com/400x225"}
                alt={closet.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{closet.name}</h3>
              <Badge variant={closet.isPublic ? "default" : "secondary"}>
                {closet.isPublic ? "공개" : "비공개"}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">
              {closet.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}