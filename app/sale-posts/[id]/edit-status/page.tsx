import SalePostStatusUpdater from "@/components/SalePostStatusUpdater"

interface Props {
  params: {
    id: string
  }
}

export default function EditSalePostStatusPage({ params }: Props) {
  const salePostId = Number(params.id)
  return <SalePostStatusUpdater salePostId={salePostId} />
}