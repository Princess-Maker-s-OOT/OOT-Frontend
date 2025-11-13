import { Loader2 } from "lucide-react"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <Loader2
      className={`animate-spin ${sizeClasses[size]} ${className ?? ""}`}
      aria-label="로딩 중..."
    />
  )
}

export function LoadingView() {
  return (
    <div className="flex items-center justify-center p-8" role="status">
      <Spinner size="lg" />
    </div>
  )
}

interface ErrorViewProps {
  message?: string
  retry?: () => void
}

export function ErrorView({ message = "오류가 발생했습니다.", retry }: ErrorViewProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
      role="alert"
    >
      <p className="text-lg font-medium text-destructive">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          다시 시도
        </button>
      )}
    </div>
  )
}