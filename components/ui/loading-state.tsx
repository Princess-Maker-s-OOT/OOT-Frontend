import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "./alert"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  isLoading?: boolean
  error?: string
  onRetry?: () => void
  children: React.ReactNode
  className?: string
}

export function LoadingState({
  isLoading,
  error,
  onRetry,
  children,
  className,
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className={cn("mx-auto max-w-2xl", className)}>
        <AlertDescription className="flex items-center gap-4">
          <span>{error}</span>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              다시 시도
            </Button>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}