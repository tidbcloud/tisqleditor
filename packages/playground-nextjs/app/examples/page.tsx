import { GithubIcon, FullscreenIcon } from 'lucide-react'
import Link from 'next/link'

import { DynamicEditorExample } from '@/components/biz/dynamic-editor-example'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { ExampleSelect } from './example-select'
import { EditorThemeSelect } from './editor-theme-select'

export default function Page({
  searchParams
}: {
  searchParams?: {
    ex?: string
    theme?: string
  }
}) {
  const ex = searchParams?.ex ?? 'all'
  const editorTheme = searchParams?.theme ?? 'oneDark'

  const showOutputBox = ex === 'events' || ex === 'all'

  return (
    <main className="flex min-h-screen place-items-center justify-center p-4">
      <div className="max-w-7xl min-w-[800px]">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight sm:text-3xl">
            TiSQLEditor
          </h1>

          <div className="mt-10 flex items-center gap-1">
            <ExampleSelect />
            <EditorThemeSelect />
            <Button variant="ghost" size="icon">
              <Link href={`/example?ex=${ex}&theme=${editorTheme}`}>
                <FullscreenIcon className="h-4 w-4" />
              </Link>
            </Button>

            <div className="mr-auto"></div>

            <Button variant="outline">
              <Link href={`/playground`}>Playground</Link>
            </Button>
            <Button variant="ghost" size="icon">
              <a
                href="https://github.com/tidbcloud/tisqleditor"
                target="_blank"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            </Button>
          </div>

          <div
            className={cn(
              'mt-2 text-left',
              showOutputBox ? 'h-[600px]' : 'h-[400px]'
            )}
          >
            <DynamicEditorExample
              example={ex}
              theme={editorTheme}
              withSelect={true}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
