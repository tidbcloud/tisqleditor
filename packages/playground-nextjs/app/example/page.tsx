import { EditorExample } from '@/components/biz/editor-example'

export default async function Page({
  searchParams
}: {
  searchParams?: Promise<{
    ex?: string
    theme?: string
  }>
}) {
  const params = await searchParams
  return (
    <main className="h-screen">
      <EditorExample example={params?.ex} theme={params?.theme} />
    </main>
  )
}
