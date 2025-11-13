import EditClosetForm from "@/components/EditClosetForm"
import DeleteClosetButton from "@/components/DeleteClosetButton"

interface Props {
  params: {
    closetId: string
  }
}

export default function EditClosetPage({ params }: Props) {
  const closetId = Number(params.closetId)

  return (
    <div className="space-y-8">
      <EditClosetForm closetId={closetId} />
      <DeleteClosetButton closetId={closetId} />
    </div>
  )
}