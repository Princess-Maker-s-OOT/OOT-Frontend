"use client"

import { useEffect, useState } from "react"
import { getDeviceList } from "@/lib/api/auth"

export default function MyDevices() {
  const [devices, setDevices] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const deviceId = localStorage.getItem("deviceId")

    if (!token || !deviceId) {
      setError("로그인이 필요합니다.")
      return
    }

    getDeviceList().then((res) => {
      if (res.success) {
        setDevices(res.data)
      } else {
        setError(res.message || "디바이스 조회 실패")
      }
    })
  }, [])

  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">내 디바이스 목록</h1>
      {devices.map((device: any) => (
        <div key={device.deviceId} className="border p-4 rounded">
          <p className="font-semibold">{device.deviceName}</p>
          <p className="text-sm text-gray-500">IP: {device.ipAddress}</p>
          <p className="text-sm text-gray-500">마지막 사용: {device.lastUsedAt}</p>
          <p className="text-sm text-gray-500">만료: {device.expiresAt}</p>
          {device.current && <span className="text-green-600 text-sm">현재 디바이스</span>}
        </div>
      ))}
    </div>
  )
}