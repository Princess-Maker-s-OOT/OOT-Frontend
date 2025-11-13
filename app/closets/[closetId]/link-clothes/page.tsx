import LinkClothesForm from "@/components/LinkClothesForm"

interface Props {
  params: {
    closetId: string
  }
}

export default function LinkClothesPage({ params }: Props) {
  const closetId = Number(params.closetId)
  return <LinkClothesForm closetId={closetId} />
}