export function formatRelativeTime(iso: string): string {
  const now = new Date()
  const past = new Date(iso)
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diff < 60) return `${diff}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}