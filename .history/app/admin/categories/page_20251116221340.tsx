"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FolderTree, Plus, Edit, Trash2, X } from "lucide-react"
import { getCategories, buildCategoryTree, createCategory, updateCategory, deleteCategory, type CategoryNode, type CategoryRequest } from "@/lib/api/categories"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([])
  const [flatCategories, setFlatCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null)
  const [formData, setFormData] = useState<CategoryRequest>({ name: "", parentId: null })
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  async function loadCategories() {
    try {
      setLoading(true)
      const result = await getCategories(0, 200)
      if (result.success && result.data) {
        setFlatCategories(result.data.content)
        const tree = buildCategoryTree(result.data.content)
        setCategories(tree)
      }
    } catch (err) {
      console.error("카테고리 로드 실패:", err)
      toast({
        title: "오류",
        description: "카테고리를 불러오는데 실패했습니다.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateCategory() {
    if (!formData.name.trim()) {
      toast({
        title: "입력 오류",
        description: "카테고리 이름을 입력해주세요.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const result = await createCategory(formData)
      
      if (result.success) {
        toast({
          title: "성공",
          description: "카테고리가 생성되었습니다.",
        })
        setShowAddDialog(false)
        setFormData({ name: "", parentId: null })
        loadCategories()
      } else {
        toast({
          title: "실패",
          description: result.message || "카테고리 생성에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "오류",
        description: err?.message || "카테고리 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdateCategory() {
    if (!selectedCategory || !formData.name.trim()) {
      return
    }

    try {
      setSubmitting(true)
      const result = await updateCategory(selectedCategory.id, formData)
      
      if (result.success) {
        toast({
          title: "성공",
          description: "카테고리가 수정되었습니다.",
        })
        setShowEditDialog(false)
        setSelectedCategory(null)
        setFormData({ name: "", parentId: null })
        loadCategories()
      } else {
        toast({
          title: "실패",
          description: result.message || "카테고리 수정에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "오류",
        description: err?.message || "카테고리 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDeleteCategory() {
    if (!selectedCategory) return

    try {
      setSubmitting(true)
      const result = await deleteCategory(selectedCategory.id)
      
      if (result.success) {
        toast({
          title: "성공",
          description: "카테고리가 삭제되었습니다.",
        })
        setShowDeleteDialog(false)
        setSelectedCategory(null)
        loadCategories()
      } else {
        toast({
          title: "실패",
          description: result.message || "카테고리 삭제에 실패했습니다.",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "오류",
        description: err?.message || "카테고리 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  function openAddDialog() {
    setFormData({ name: "", parentId: null })
    setShowAddDialog(true)
  }

  function openEditDialog(node: CategoryNode) {
    setSelectedCategory(node)
    setFormData({ name: node.name, parentId: null })
    setShowEditDialog(true)
  }

  function openDeleteDialog(node: CategoryNode) {
    setSelectedCategory(node)
    setShowDeleteDialog(true)
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => openEditDialog(node)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => openDeleteDialog(node)}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
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
        <Button onClick={openAddDialog}>
          <Plus className="w-4 h-4 mr-2" />
          카테고리 추가
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">최상위 카테고리</p>
            <p className="text-2xl font-bold mt-1">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">전체 카테고리</p>
            <p className="text-2xl font-bold mt-1">{flatCategories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">하위 카테고리</p>
            <p className="text-2xl font-bold mt-1">{flatCategories.length - categories.length}</p>
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

      {/* 추가 다이얼로그 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 추가</DialogTitle>
            <DialogDescription>
              새로운 카테고리를 추가합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">카테고리 이름</Label>
              <Input
                id="name"
                placeholder="예: 상의, 하의, 아우터 등"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentId">상위 카테고리 (선택)</Label>
              <Select
                value={formData.parentId?.toString() || "none"}
                onValueChange={(value) => 
                  setFormData({ ...formData, parentId: value === "none" ? null : parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="상위 카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음 (최상위)</SelectItem>
                  {flatCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              취소
            </Button>
            <Button onClick={handleCreateCategory} disabled={submitting}>
              {submitting ? "추가 중..." : "추가"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 수정</DialogTitle>
            <DialogDescription>
              카테고리 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">카테고리 이름</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              취소
            </Button>
            <Button onClick={handleUpdateCategory} disabled={submitting}>
              {submitting ? "수정 중..." : "수정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>카테고리 삭제</DialogTitle>
            <DialogDescription>
              정말로 <strong>{selectedCategory?.name}</strong> 카테고리를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              취소
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory} 
              disabled={submitting}
            >
              {submitting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
