"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface SalePost {
  salePostId: number
  title: string
  content: string
  price: number
  status: "AVAILABLE" | "SOLD"
  tradeAddress: string
  sellerNickname: string
  categoryName: string
  imageUrls: string[]
  createdAt: string
}

interface SearchResponse {
  httpStatus: string
  statusValue: number
  success: boolean
  code: string
  message: string
  timestamp: string
  data: {
    content: SalePost[]
    totalElements: number
    totalPages: number
    size: number
    number: number
  }
}

export default function SalePostSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<SalePost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // 검색 실행
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const params = new URLSearchParams()
      params.append("title", searchQuery)
      params.append("page", "0")
      params.append("size", "20")

      const res = await fetch(`/api/v1/sale-posts?${params.toString()}`)

      if (!res.ok) {
        throw new Error(`검색 실패: ${res.status}`)
      }

      const json: SearchResponse = await res.json()

      if (json.success && json.data) {
        setSearchResults(json.data.content)
      } else {
        setError(json.message || "검색에 실패했습니다.")
      }
    } catch (err: any) {
      console.error("검색 오류:", err)
      setError(err?.message || "검색 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 검색어 제출 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/sale-posts/search?q=${encodeURIComponent(query)}`)
    performSearch(query)
  }

  // URL 파라미터가 변경될 때 자동 검색
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 검색 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">판매글 검색</h1>

          {/* 검색 입력 */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="제목으로 검색하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={loading} className="bg-sky-600 hover:bg-sky-700">
              <Search className="h-4 w-4 mr-2" />
              {loading ? "검색중..." : "검색"}
            </Button>
          </form>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* 검색 결과 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">검색 중...</p>
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                <strong>{searchResults.length}개</strong>의 판매글을 찾았습니다.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((post) => (
                  <Link key={post.salePostId} href={`/sale-posts/${post.salePostId}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {/* 이미지 */}
                      <div className="aspect-square relative bg-gray-100">
                        {post.imageUrls && post.imageUrls.length > 0 ? (
                          <img
                            src={post.imageUrls[0]}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        {/* 상태 배지 */}
                        {post.status === "SOLD" && (
                          <div className="absolute top-2 left-2 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            판매완료
                          </div>
                        )}
                      </div>

                      {/* 정보 */}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{post.title}</h3>
                        <p className="text-sky-600 font-bold text-xl mb-2">
                          ₩{post.price.toLocaleString()}
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p className="line-clamp-1">{post.tradeAddress}</p>
                          <p className="line-clamp-1">{post.sellerNickname}</p>
                        </div>
                        <div className="mt-2">
                          <span className="inline-block bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded">
                            {post.categoryName}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                <strong>"{query}"</strong>에 대한 검색 결과가 없습니다.
              </p>
              <p className="text-gray-500 text-sm mt-2">
                다른 검색어로 시도해보세요.
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">검색어를 입력해주세요</p>
            <p className="text-gray-500 text-sm mt-2">
              찾으시는 판매글의 제목을 검색해보세요.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
