import LinkClothesForm from "@/components/LinkClothesForm"

interface Props {
  params: Promise<{
    closetId: string
  }>
}

export default async function LinkClothesPage({ params }: Props) {
  const resolvedParams = await params
  const closetId = Number(resolvedParams.closetId)
  return <LinkClothesForm closetId={closetId} />
}