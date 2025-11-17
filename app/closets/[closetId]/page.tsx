import ClosetDetail from "@/components/ClosetDetail"

interface Props {
  params: Promise<{
    closetId: string
  }>
}

export default async function ClosetDetailPage({ params }: Props) {
  const resolvedParams = await params
  const closetId = Number(resolvedParams.closetId)
  return <ClosetDetail closetId={closetId} />
}