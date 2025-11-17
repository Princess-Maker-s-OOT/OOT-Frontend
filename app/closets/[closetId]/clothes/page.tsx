import ClosetClothesList from "@/components/ClosetClothesList"

interface Props {
  params: Promise<{
    closetId: string
  }>
}

export default async function ClosetClothesPage({ params }: Props) {
  const resolvedParams = await params
  const closetId = Number(resolvedParams.closetId)
  return <ClosetClothesList closetId={closetId} />
}