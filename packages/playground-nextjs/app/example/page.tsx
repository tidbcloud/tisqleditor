import { EditorExample } from '@/components/biz/editor-example'

export default function Page({
  searchParams
}: {
  searchParams?: {
    ex?: string
    theme?: string
  }
}) {
  return (
    <main className="h-screen">
      <EditorExample example={searchParams?.ex} theme={searchParams?.theme} />
    </main>
  )
}
