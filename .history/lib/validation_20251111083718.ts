import { z } from "zod";

export const SignupSchema = z.object({
  loginId: z.string().min(4).max(15),
  email: z.string().email(),
  nickname: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  phoneNumber: z.string().regex(/^010\d{8}$/),
});

export type SignupRequest = z.infer<typeof SignupSchema>;

export const CreateSalePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  price: z.number().min(0),
  categoryId: z.number().int(),
  tradeAddress: z.string().min(1),
  tradeLatitude: z.string(),
  tradeLongitude: z.string(),
  imageUrls: z.array(z.string().url()),
});

export type CreateSalePostRequest = z.infer<typeof CreateSalePostSchema>;

export const UpdateSalePostSchema = CreateSalePostSchema;
export type UpdateSalePostRequest = CreateSalePostRequest;

export const VerifyPasswordSchema = z.object({
  password: z.string().min(1, "비밀번호를 입력해주세요."),
})

export const UpdateMyInfoSchema = z.object({
  email: z.string().email("이메일 형식이 올바르지 않습니다.").nullable().optional(),
  nickname: z.string().min(2).max(10).refine((val) => val.trim() === val, "닉네임 전후 공백은 불가합니다.").nullable().optional(),
  username: z.string().min(2).max(50).refine((val) => !val.includes(" "), "이름 내 공백은 불가합니다.").nullable().optional(),
  password: z.string().regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[^\s]{8,}$/, {
    message: "비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 하고 공백은 불가합니다.",
  }).nullable().optional(),
  phoneNumber: z.string().regex(/^010\d{8}$/, "전화번호 형식은 01012345678 형태여야 합니다.").nullable().optional(),
})

export const UpdateProfileImageSchema = z.object({
  imageId: z.number().int(),
})

export type VerifyPasswordRequest = z.infer<typeof VerifyPasswordSchema>
export type UpdateMyInfoRequest = z.infer<typeof UpdateMyInfoSchema>
export type UpdateProfileImageRequest = z.infer<typeof UpdateProfileImageSchema>


export const CreateClosetSchema = z.object({
  name: z.string().min(1, "옷장 이름은 필수입니다."),
  description: z.string().min(1, "옷장 설명을 입력해주세요."),
  imageId: z.number().int(),
  isPublic: z.boolean(),
})

export type CreateClosetRequest = z.infer<typeof CreateClosetSchema>

export const UpdateClosetSchema = z.object({
  name: z.string().min(1, "옷장 이름은 필수입니다."),
  description: z.string().min(1, "옷장 설명을 입력해주세요."),
  imageId: z.number().int(),
  isPublic: z.boolean(),
})

export type UpdateClosetRequest = z.infer<typeof UpdateClosetSchema>

export const LinkClothesToClosetSchema = z.object({
  clothesId: z.number().int(),
})

export type LinkClothesToClosetRequest = z.infer<typeof LinkClothesToClosetSchema>

export const CreateWearRecordSchema = z.object({
  clothesId: z.number().int({ message: "옷 ID는 필수입니다." }),
})

export type CreateWearRecordRequest = z.infer<typeof CreateWearRecordSchema>

export const CreatePresignedUrlSchema = z.object({
  fileName: z.string().min(1, "파일명을 입력해주세요."),
  type: z.enum(["closet", "clothes"], {
    errorMap: () => ({ message: "유효한 타입을 입력해주세요." }),
  }),
})

export type CreatePresignedUrlRequest = z.infer<typeof CreatePresignedUrlSchema>

export const SaveImageMetadataSchema = z.object({
  fileName: z.string().min(1, "파일명은 필수입니다."),
  url: z.string().url("유효한 URL 형식이 아닙니다."),
  s3Key: z.string().min(1, "S3 Key는 필수입니다."),
  contentType: z.string().min(1, "Content-Type은 필수입니다."),
  type: z.enum(["CLOSET", "CLOTHES", "SALEPOST", "USER"], {
    errorMap: () => ({
      message: "이미지 타입은 CLOSET, CLOTHES, SALEPOST, USER 중 하나여야 합니다.",
    }),
  }),
  size: z.number().int().positive(),
})

export type SaveImageMetadataRequest = z.infer<typeof SaveImageMetadataSchema>

// Allow creating a sale post from recommendation using same shape as CreateSalePost
export type CreateSalePostFromRecommendationRequest = CreateSalePostRequest