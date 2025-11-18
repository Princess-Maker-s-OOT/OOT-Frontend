import CreateSalePostFromRecommendationForm from "@/components/CreateSalePostFromRecommendationForm"

export default function Page({ params }: any) {
  const recommendationId = Number(params.recommendationId)
  return <CreateSalePostFromRecommendationForm recommendationId={recommendationId} />
}