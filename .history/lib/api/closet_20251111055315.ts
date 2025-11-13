import {
  CreateClosetRequest,
  CreateClosetSuccessResponse,
  CreateClosetErrorResponse,
  GetPublicClosetsQuery,
  GetPublicClosetsSuccessResponse,
  GetClosetByIdSuccessResponse,
  GetClosetByIdErrorResponse,
  GetMyClosetsSuccessResponse,
  UpdateClosetRequest,
  UpdateClosetSuccessResponse,
  UpdateClosetErrorResponse,
  DeleteClosetSuccessResponse,
  DeleteClosetErrorResponse,
  LinkClothesToClosetRequest,
  LinkClothesToClosetSuccessResponse,
  LinkClothesToClosetErrorResponse,
  GetClosetClothesSuccessResponse,
  GetClosetClothesErrorResponse,
  RemoveClothesFromClosetSuccessResponse,
  RemoveClothesFromClosetErrorResponse,
} from "@/lib/types/closet"

export async function createCloset(
  data: CreateClosetRequest,
  accessToken: string
): Promise<CreateClosetSuccessResponse | CreateClosetErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/closets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getPublicClosets(
  query: GetPublicClosetsQuery,
  accessToken?: string
): Promise<GetPublicClosetsSuccessResponse> {
  // 로그인 없는 경우 mock 데이터 반환
  if (!accessToken) {
    const { MOCK_CLOSETS, createMockResponse } = await import("@/lib/mocks")
    const content = MOCK_CLOSETS.filter((c) => c.isPublic)
    return createMockResponse({
      content,
      totalElements: content.length,
      totalPages: 1,
      size: content.length,
      number: 0,
    })
  }

  const params = new URLSearchParams()
  if (query.page !== undefined) params.append("page", query.page.toString())
  if (query.size !== undefined) params.append("size", query.size.toString())
  if (query.sort) params.append("sort", query.sort)
  if (query.direction) params.append("direction", query.direction)

  const response = await fetch(`http://localhost:8080/api/v1/closets/public?${params.toString()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await response.json()
}

export async function getClosetById(
  closetId: number,
  accessToken: string
): Promise<GetClosetByIdSuccessResponse | GetClosetByIdErrorResponse> {
  const response = await fetch(`http://localhost:8080/api/v1/closets/${closetId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await response.json()
}

export async function getMyClosets(
  accessToken: string
): Promise<GetMyClosetsSuccessResponse> {
  const response = await fetch("http://localhost:8080/api/v1/closets/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await response.json()
}

export async function updateCloset(
  closetId: number,
  data: UpdateClosetRequest,
  accessToken: string
): Promise<UpdateClosetSuccessResponse | UpdateClosetErrorResponse> {
  const response = await fetch(`http://localhost:8080/api/v1/closets/${closetId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function deleteCloset(
  closetId: number,
  accessToken: string
): Promise<DeleteClosetSuccessResponse | DeleteClosetErrorResponse> {
  const response = await fetch(`http://localhost:8080/api/v1/closets/${closetId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await response.json()
}

export async function linkClothesToCloset(
  closetId: number,
  data: LinkClothesToClosetRequest,
  accessToken: string
): Promise<LinkClothesToClosetSuccessResponse | LinkClothesToClosetErrorResponse> {
  const response = await fetch(`http://localhost:8080/api/v1/closets/${closetId}/clothes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getClosetClothes(
  closetId: number,
  accessToken: string
): Promise<GetClosetClothesSuccessResponse | GetClosetClothesErrorResponse> {
  const response = await fetch(`http://localhost:8080/api/v1/closets/${closetId}/clothes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return await response.json()
}

export async function removeClothesFromCloset(
  closetId: number,
  clothesId: number,
  accessToken: string
): Promise<RemoveClothesFromClosetSuccessResponse | RemoveClothesFromClosetErrorResponse> {
  const response = await fetch(
    `http://localhost:8080/api/v1/closets/${closetId}/clothes/${clothesId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  return await response.json()
}