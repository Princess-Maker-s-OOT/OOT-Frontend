import ClosetClothesList from "@/components/ClosetClothesList"

interface Props {
  params: {
    closetId: string
  }
}

export default function ClosetClothesPage({ params }: Props) {
  const closetId = Number(params.closetId)
  return <ClosetClothesList closetId={closetId} />
}