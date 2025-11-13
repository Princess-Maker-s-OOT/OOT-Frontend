"use client"

import CategorySidebar from "@/components/category-sidebar"
import { getMockCategories } from "@/lib/mockData"
import { useRouter } from "next/navigation"

export default function SidebarWrapper() {
  const router = useRouter()
  const categories = getMockCategories()

  return (
    <CategorySidebar
      categories={categories}
      onSelect={(id) => {
        router.push(`/sale-posts?categoryId=${id}`)
      }}
    />
  )
}