"use client"

import { useEffect } from "react"
import CategorySidebar from "@/components/category-sidebar"
import { getMockCategories } from "@/lib/mockData"

type Props = {
  open: boolean
  onClose: () => void
}

export default function SidebarDrawer({ open, onClose }: Props) {
  const categories = getMockCategories()

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
  }, [open])

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-sky-50 shadow-lg z-50 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-base font-semibold text-sky-700">카테고리</h2>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-sky-600">닫기</button>
      </div>
      <CategorySidebar
        categories={categories}
        onSelect={(id) => {
          onClose()
          // router.push(`/sale-posts?categoryId=${id}`) 가능
        }}
      />
    </div>
  )
}