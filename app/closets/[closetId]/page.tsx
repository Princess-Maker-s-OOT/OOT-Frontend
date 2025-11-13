import ClosetDetail from "@/components/ClosetDetail"

interface Props {
  params: {
    closetId: string
  }
}

export default function ClosetDetailPage({ params }: Props) {
  const closetId = Number(params.closetId)
  return <ClosetDetail closetId={closetId} />
}