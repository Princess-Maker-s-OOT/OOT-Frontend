/**
 * Kakao Maps SDK 로더 - 서버 사이드 친화적 방식
 * 환경 변수에서 API 키를 가져와 동적으로 스크립트 로드
 */

type KakaoMapsLoaderState = "idle" | "loading" | "loaded" | "error"

interface KakaoMapsLoaderOptions {
  appKey: string
  libraries?: string[]
  version?: string
  autoLoad?: boolean
}

class KakaoMapsLoader {
  private static instance: KakaoMapsLoader
  private state: KakaoMapsLoaderState = "idle"
  private loadPromise: Promise<void> | null = null
  private appKey: string
  private libraries: string[]
  private version: string

  private constructor(options: KakaoMapsLoaderOptions) {
    this.appKey = options.appKey
    this.libraries = options.libraries || ["services", "clusterer", "drawing"]
    this.version = options.version || "2"

    if (options.autoLoad !== false) {
      this.load()
    }
  }

  /**
   * 싱글톤 인스턴스 가져오기 또는 생성
   */
  static getInstance(options?: KakaoMapsLoaderOptions): KakaoMapsLoader {
    // 이미 window.kakao가 로드되어 있으면 새 인스턴스 생성
    if (typeof window !== "undefined" && (window as any).kakao?.maps) {
      console.log("🔄 Kakao Maps already loaded in window, creating fresh instance")
      if (options) {
        KakaoMapsLoader.instance = new KakaoMapsLoader(options)
      }
    } else if (!KakaoMapsLoader.instance && options) {
      KakaoMapsLoader.instance = new KakaoMapsLoader(options)
    }
    return KakaoMapsLoader.instance
  }

  /**
   * 싱글톤 리셋 (디버깅용)
   */
  static reset(): void {
    console.log("🔄 Resetting KakaoMapsLoader instance")
    KakaoMapsLoader.instance = null as any
  }

  /**
   * 현재 로딩 상태 반환
   */
  getState(): KakaoMapsLoaderState {
    return this.state
  }

  /**
   * SDK 로드 시작
   */
  async load(): Promise<void> {
    // window.kakao가 이미 있으면 바로 반환
    if (typeof window !== "undefined" && (window as any).kakao?.maps) {
      console.log("✅ Kakao Maps already exists in window")
      this.state = "loaded"
      return Promise.resolve()
    }

    // 이미 로드됨
    if (this.state === "loaded") {
      console.log("✅ Already loaded")
      return
    }

    // 이미 로딩 중
    if (this.state === "loading" && this.loadPromise) {
      console.log("⏳ Already loading, waiting...")
      return this.loadPromise
    }

    // 에러 상태면 재시도
    if (this.state === "error") {
      console.log("🔄 Retrying after error...")
      this.state = "idle"
      this.loadPromise = null
    }

    if (this.state !== "idle") {
      return
    }

    console.log("🚀 Starting Kakao Maps load...")
    this.state = "loading"
    this.loadPromise = this._loadScript()

    return this.loadPromise
  }

  /**
   * 실제 스크립트 로드 구현
   */
  private _loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // 서버 사이드 렌더링 환경 체크
      if (typeof window === "undefined") {
        reject(new Error("Window object not available"))
        return
      }

      // 이미 로드됨 확인
      if ((window as any).kakao?.maps) {
        console.log("✅ Kakao Maps already loaded")
        this.state = "loaded"
        resolve()
        return
      }

      try {
        // API 키 유효성 확인
        if (!this.appKey || this.appKey.length < 20) {
          throw new Error(
            "Invalid API Key: NEXT_PUBLIC_KAKAO_MAP_KEY is not set or too short"
          )
        }

        // 스크립트 URL 구성
        const scriptUrl = this._buildScriptUrl()
        console.log("📋 Loading Kakao Maps SDK from:", scriptUrl.substring(0, 60) + "...")

        // 스크립트 엘리먼트 생성
        const script = document.createElement("script")
        script.src = scriptUrl
        // async, defer 제거 (document.write 오류 방지)

        // 로드 성공
        script.onload = () => {
          console.log("✅ Kakao Maps SDK script loaded successfully (autoload=false)")

          // autoload=false이므로 kakao 객체는 있지만 maps는 로드되지 않음
          setTimeout(() => {
            const kakao = (window as any).kakao
            if (kakao) {
              console.log("✅ Kakao object available, maps will be loaded via kakao.maps.load()")
              this.state = "loaded"
              resolve()
            } else {
              console.error("❌ Kakao object not found")
              this.state = "error"
              reject(new Error("Kakao Maps object not found after loading"))
            }
          }, 100)
        }

        // 로드 실패
        script.onerror = () => {
          console.error("❌ Failed to load Kakao Maps SDK")
          this.state = "error"
          reject(new Error("Failed to load Kakao Maps SDK script"))
        }

        // 스크립트 태그 추가
        document.head.appendChild(script)
      } catch (error) {
        console.error("❌ Kakao Maps loading error:", error)
        this.state = "error"
        reject(error)
      }
    })
  }

  /**
   * SDK 스크립트 URL 구성
   */
  private _buildScriptUrl(): string {
    const baseUrl = `https://dapi.kakao.com/v${this.version}/maps/sdk.js`
    const params = new URLSearchParams()
    params.set("appkey", this.appKey)
    // autoload=false 사용 - 수동으로 kakao.maps.load() 호출 필요
    params.set("autoload", "false")

    if (this.libraries.length > 0) {
      params.set("libraries", this.libraries.join(","))
    }

    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Kakao 객체 접근
   */
  getKakao(): any {
    if (typeof window === "undefined") {
      return null
    }
    return (window as any).kakao
  }

  /**
   * 준비 완료 대기 (비동기)
   */
  async ready(): Promise<any> {
    await this.load()
    return this.getKakao()
  }
}

export default KakaoMapsLoader
