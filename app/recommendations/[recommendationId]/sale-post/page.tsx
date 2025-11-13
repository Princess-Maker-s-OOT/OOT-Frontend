import CreateSalePostFromRecommendationForm from "@/components/CreateSalePostFromRecommendationForm"

export default function Page({ params }: { params: { recommendationId: string } }) {
  const recommendationId = Number(params.recommendationId)
  return <CreateSalePostFromRecommendationForm recommendationId={recommendationId} />
}