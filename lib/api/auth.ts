export async function getDeviceList(currentDeviceId: string, accessToken: string) {
  const response = await fetch(
    `/api/v1/auth/devices?currentDeviceId=${currentDeviceId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  )

  const result = await response.json()
  return result
}