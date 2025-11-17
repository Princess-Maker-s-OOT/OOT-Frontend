import EditClosetForm from "@/components/EditClosetForm"
import DeleteClosetButton from "@/components/DeleteClosetButton"

interface Props {
  params: Promise<{
    closetId: string
  }>
}

export default async function EditClosetPage({ params }: Props) {
  const resolvedParams = await params
  const closetId = Number(resolvedParams.closetId)

  return (
    <div className="space-y-8">
      <EditClosetForm closetId={closetId} />
      <DeleteClosetButton closetId={closetId} />
    </div>
  )
}