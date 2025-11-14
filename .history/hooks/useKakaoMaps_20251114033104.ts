"use client"

import { useEffect, useState, useCallback } from "react"
import KakaoMapsLoader from "@/lib/utils/kakao-maps-loader"

interface UseKakaoMapsOptions {
  autoLoad?: boolean
  onLoaded?: () => void
  onError?: (error: Error) => void
}

interface UseKakaoMapsReturn {
  isLoaded: boolean
  isLoading: boolean
  error: Error | null
  kakao: any
  reload: () => Promise<void>
}

/**
 * Kakao Maps SDK 로딩을 관리하는 React 훅
 * 싱글톤 패턴으로 중복 로드 방지
 */
export function useKakaoMaps(options: UseKakaoMapsOptions = {}): UseKakaoMapsReturn {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [kakao, setKakao] = useState<any>(null)

  // API 키 가져오기
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAPS_APP_KEY

  // 로더 초기화
  const loader = KakaoMapsLoader.getInstance({
    appKey: apiKey || "",
    autoLoad: false, // 훅에서 수동으로 제어
  })

  // 로드 함수
  const load = useCallback(async () => {
    if (isLoaded) return
    if (!apiKey) {
      const err = new Error("NEXT_PUBLIC_KAKAO_MAPS_APP_KEY is not set")
      setError(err)
      options.onError?.(err)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await loader.load()
      const kakaoObj = loader.getKakao()

      if (kakaoObj?.maps) {
        setKakao(kakaoObj)
        setIsLoaded(true)
        options.onLoaded?.()
      } else {
        throw new Error("Kakao Maps not initialized properly")
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      options.onError?.(error)
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, isLoaded, loader, options])

  // 자동 로드
  useEffect(() => {
    if (options.autoLoad !== false) {
      load()
    }
  }, [load, options.autoLoad])

  // 재로드 함수
  const reload = useCallback(async () => {
    setIsLoaded(false)
    setError(null)
    await load()
  }, [load])

  return {
    isLoaded,
    isLoading,
    error,
    kakao,
    reload,
  }
}
