"use client"

import { useEffect, useState } from "react"
import { getWearRecords } from "@/lib/api/wear-record"
import type { WearRecordItem } from "@/lib/types/wear-record"

export default function MyWearRecordList() {
  const [records, setRecords] = useState<WearRecordItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getWearRecords(token).then((res) => {
      if ("data" in res) setRecords(res.data.content)
  else setError((res as any)?.message ?? "오류가 발생했습니다.")
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>
  if (!records.length) return <div className="p-6 text-sm text-gray-500">착용 기록이 없습니다.</div>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold text-sky-700 mb-4">내 착용 기록</h1>
      {records.map((record) => (
        <div key={record.wearRecordId} className="border rounded p-4 bg-white shadow-sm flex gap-4 items-center">
          <img src={record.clothesImageUrl} alt="옷 이미지" className="w-20 h-20 object-cover rounded" />
          <div>
            <h2 className="text-lg font-semibold">{record.clothesName}</h2>
            <p className="text-sm text-gray-600">착용일: {record.wornAt}</p>
            <p className="text-xs text-gray-400">옷 ID: {record.clothesId}</p>
          </div>
        </div>
      ))}
    </div>
  )
}