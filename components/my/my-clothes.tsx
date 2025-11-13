import { MOCK_CLOTHES } from "@/lib/mocks"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MyClothes() {
  const clothes = MOCK_CLOTHES

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">내 옷 관리</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          옷 등록
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clothes.map((item) => (
          <Card key={item.clothesId} className="p-4">
            <div className="aspect-square relative overflow-hidden rounded-lg mb-2">
              <img
                src={item.images[0]?.imageUrl ?? "https://via.placeholder.com/200"}
                alt={item.name}
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.brand}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {item.size}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {item.color}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}