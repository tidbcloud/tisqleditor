import { DynamicEditorExample } from '@/components/biz/dynamic-editor-example'

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
      <DynamicEditorExample
        example={searchParams?.ex}
        theme={searchParams?.theme}
      />
    </main>
  )
}
