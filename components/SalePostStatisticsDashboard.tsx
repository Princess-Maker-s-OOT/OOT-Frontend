"use client"

import { useEffect, useState } from "react"
import { getSalePostStatistics } from "@/lib/api/admin"
import type { SalePostStatusCount } from "@/lib/types/admin"

export default function SalePostStatisticsDashboard() {
  const [total, setTotal] = useState<number>(0)
  const [statusCounts, setStatusCounts] = useState<SalePostStatusCount[]>([])
  const [newCounts, setNewCounts] = useState<{ daily: number; weekly: number; monthly: number }>({
    daily: 0,
    weekly: 0,
    monthly: 0,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (!token) {
      setError("로그인이 필요합니다.")
      return
    }

    getSalePostStatistics(token).then((res) => {
      if ("data" in res) {
        setTotal(res.data.totalSales)
        setStatusCounts(res.data.salePostStatusCounts)
        setNewCounts(res.data.newSalePost)
      } else {
        setError(res.message)
      }
    })
  }, [])

  if (error) return <div className="p-6 text-red-500 text-sm">{error}</div>

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-sky-700">판매글 통계 대시보드</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">전체 판매글 수</h2>
        <p className="text-2xl font-bold text-sky-700">{total.toLocaleString()}건</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatSection title="상태별 판매글 수" items={statusCounts.map((s) => [s.saleStatus, s.count])} />
        <StatSection
          title="신규 등록 수"
          items={[
            ["일간", newCounts.daily],
            ["주간", newCounts.weekly],
            ["월간", newCounts.monthly],
          ]}
        />
      </div>
    </div>
  )
}

function StatSection({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <ul className="space-y-1 text-sm">
        {items.map(([label, count]) => (
          <li key={label} className="flex justify-between">
            <span>{label}</span>
            <span className="font-medium">{count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}