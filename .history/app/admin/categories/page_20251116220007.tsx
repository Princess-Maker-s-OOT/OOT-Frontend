"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderTree, Plus, Edit, Trash2 } from "lucide-react"
import { getCategories, buildCategoryTree, type CategoryNode } from "@/lib/api/categories"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const result = await getCategories(0, 200)
      if (result.success && result.data) {
        const tree = buildCategoryTree(result.data.content)
        setCategories(tree)
      }
    } catch (err) {
      console.error("카테고리 로드 실패:", err)
    } finally {
      setLoading(false)
    }
  }

  function renderCategoryTree(nodes: CategoryNode[], depth = 0) {
    return nodes.map((node) => (
      <div key={node.id} style={{ marginLeft: `${depth * 24}px` }}>
        <div className="flex items-center justify-between p-3 border-b hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{node.name}</span>
            <span className="text-xs text-muted-foreground">#{node.id}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {node.children && node.children.length > 0 && renderCategoryTree(node.children, depth + 1)}
      </div>
    ))
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FolderTree className="w-8 h-8" />
            카테고리 관리
          </h1>
          <p className="text-muted-foreground mt-1">카테고리 구조 조회 및 관리</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">전체 카테고리</p>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">최상위 카테고리</p>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">하위 카테고리</p>
            <p className="text-2xl font-bold mt-1">-</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>카테고리 구조</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>카테고리를 불러오는 중...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="space-y-0">
              {renderCategoryTree(categories)}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FolderTree className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>등록된 카테고리가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
