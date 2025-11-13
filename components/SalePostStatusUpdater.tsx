"use client"

import { useState } from "react"
import { updateSalePostStatus } from "@/lib/api/sale-post"
import type { SalePostStatus } from "@/lib/types/sale-post"

interface Props {
  salePostId: number
}

const statusOptions: SalePostStatus[] = [
  "AVAILABLE",
  "RESERVED",
  "TRADING",
  "COMPLETED",
  "CANCELLED",
  "DELETED",
]

export default function SalePostStatusUpdater({ salePostId }: Props) {
  const [selected, setSelected] = useState<SalePostStatus>("AVAILABLE")
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setMessage(null)
    setError(null)

    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    setLoading(true)
    try {
      const result = await updateSalePostStatus(salePostId, { status: selected }, token)
      if ("success" in result && result.success) {
        setMessage(`상태가 '${result.data.status}'로 변경되었습니다.`)
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      setError(err?.message || "알 수 없는 오류")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-xl font-bold text-sky-700">판매글 상태 변경</h1>

      <div>
        <label className="block text-sm font-medium mb-1">변경할 상태</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selected}
          onChange={(e) => setSelected(e.target.value as SalePostStatus)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {message && <div className="text-sm text-green-600">{message}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex justify-end">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? "변경 중..." : "상태 변경"}
        </button>
      </div>
    </div>
  )
}