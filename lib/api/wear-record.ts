import type {
  CreateWearRecordRequest,
  CreateWearRecordSuccessResponse,
  CreateWearRecordErrorResponse,
  GetWearRecordsSuccessResponse
} from "@/lib/types/wear-record"

export async function createWearRecord(
  data: CreateWearRecordRequest,
  accessToken: string
): Promise<CreateWearRecordSuccessResponse | CreateWearRecordErrorResponse> {
  const response = await fetch("http://localhost:8080/api/v1/wear-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()
  return result
}

export async function getWearRecords(
  accessToken: string
): Promise<GetWearRecordsSuccessResponse> {
  const response = await fetch("http://localhost:8080/api/v1/wear-records", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const result = await response.json()
  return result
}