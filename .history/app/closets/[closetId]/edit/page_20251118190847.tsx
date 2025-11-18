import EditClosetForm from "@/components/EditClosetForm"

interface Props {
  params: Promise<{
    closetId: string
  }>
}

export default async function EditClosetPage({ params }: Props) {
  const resolvedParams = await params
  const closetId = Number(resolvedParams.closetId)

  return (
    <div className="min-h-screen bg-sky-100 py-10">
      <div className="max-w-[900px] mx-auto p-6 bg-white rounded-3xl shadow-lg border-2 border-pink-200 relative">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-pink-500 drop-shadow">옷장 정보 수정</h1>
        </div>
        <EditClosetForm closetId={closetId} />
        <div className="mt-8 text-center text-sm text-gray-400">
          <span>옷장 정보를 수정하고 저장하세요!</span>
        </div>
      </div>
    </div>
  )
}