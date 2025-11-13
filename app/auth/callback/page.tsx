import { Suspense } from "react"

import AuthCallbackClient from "./AuthCallbackClient"

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-oot-sky-50 to-white p-4 text-gray-600">
          인증 정보를 불러오는 중입니다...
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  )
}
