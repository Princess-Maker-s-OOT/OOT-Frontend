import { z } from "zod"

export const CreateClothesSchema = z.object({
  categoryId: z.number().int(),
  clothesSize: z.enum(["XS", "S", "M", "L", "XL"]),
  clothesColor: z.enum(["BLACK", "WHITE", "RED", "BLUE", "GREEN", "YELLOW", "GRAY", "PINK"]),
  description: z.string().min(1, "공백일 수 없습니다").max(255, "255자 이하로 입력해 주세요!"),
  images: z.array(z.number().int()),
})

export const UpdateClothesSchema = CreateClothesSchema

export type CreateClothesRequest = z.infer<typeof CreateClothesSchema>
export type UpdateClothesRequest = z.infer<typeof UpdateClothesSchema>