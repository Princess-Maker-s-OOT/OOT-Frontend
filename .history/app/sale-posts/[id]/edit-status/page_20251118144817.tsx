import SalePostStatusUpdater from "@/components/SalePostStatusUpdater"

interface Props {
  params: {
    id: string
  }
}

export default function EditSalePostStatusPage({ params }: any) {
  const salePostId = Number(params.id)
  return <SalePostStatusUpdater salePostId={salePostId} />
}