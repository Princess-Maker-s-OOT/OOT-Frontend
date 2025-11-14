/**
 * 디바이스 ID 관리 유틸리티
 * 백엔드 인증 시스템에서 요구하는 디바이스 식별을 위한 UUID 생성 및 관리
 */

const DEVICE_ID_KEY = "deviceId"
const DEVICE_NAME_KEY = "deviceName"

/**
 * UUID v4 생성
 */
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 브라우저 정보를 기반으로 디바이스 이름 생성
 */
function generateDeviceName(): string {
  const ua = navigator.userAgent
  
  // 브라우저 감지
  let browser = "Unknown Browser"
  if (ua.includes("Chrome") && !ua.includes("Edg")) {
    browser = "Chrome"
  } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "Safari"
  } else if (ua.includes("Firefox")) {
    browser = "Firefox"
  } else if (ua.includes("Edg")) {
    browser = "Edge"
  }

  // OS 감지
  let os = "Unknown OS"
  if (ua.includes("Win")) {
    os = "Windows"
  } else if (ua.includes("Mac")) {
    os = "macOS"
  } else if (ua.includes("Linux")) {
    os = "Linux"
  } else if (ua.includes("Android")) {
    os = "Android"
  } else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) {
    os = "iOS"
  }

  return `${browser} on ${os}`
}

/**
 * 저장된 디바이스 ID 가져오기 (없으면 새로 생성)
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return generateUUID() // SSR 환경
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  
  if (!deviceId) {
    deviceId = generateUUID()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }

  return deviceId
}

/**
 * 저장된 디바이스 이름 가져오기 (없으면 새로 생성)
 */
export function getDeviceName(): string {
  if (typeof window === "undefined") {
    return "Server"
  }

  let deviceName = localStorage.getItem(DEVICE_NAME_KEY)
  
  if (!deviceName) {
    deviceName = generateDeviceName()
    localStorage.setItem(DEVICE_NAME_KEY, deviceName)
  }

  return deviceName
}

/**
 * 디바이스 정보 초기화 (로그아웃 시 호출하지 않음 - 같은 기기로 인식되어야 함)
 */
export function clearDeviceInfo(): void {
  if (typeof window === "undefined") return
  
  localStorage.removeItem(DEVICE_ID_KEY)
  localStorage.removeItem(DEVICE_NAME_KEY)
}

/**
 * 디바이스 ID와 이름을 함께 반환
 */
export function getDeviceInfo(): { deviceId: string; deviceName: string } {
  return {
    deviceId: getDeviceId(),
    deviceName: getDeviceName(),
  }
}
