import { GitHubLogoIcon, PlayIcon } from '@radix-ui/react-icons'

import { DarkModeToggle } from '@/components/darkmode-toggle/toggle'
import { Button } from '@/components/ui/button'
import { useFilesContext } from '@/contexts/files-context'
import { useStatementContext } from '@/contexts/statement-context'
import { useEditorCacheContext } from '@tidbcloud/tisqleditor-react'

export function EditorActions() {
  const {
    state: { activeFileId }
  } = useFilesContext()
  const statementCtx = useStatementContext()
  const cacheCtx = useEditorCacheContext()

  async function handleRunSQL() {
    if (statementCtx === null || activeFileId === null) return
    const activeEditor = cacheCtx.getEditor(activeFileId)
    if (!activeEditor) return

    const curStatements = activeEditor.getCurStatements()
    if (curStatements[0].content === '') return

    console.log('run:', curStatements)
    const { runStatement } = statementCtx
    for (const s of curStatements) {
      const res = await runStatement(activeFileId, s)
      console.log('res:', res)
    }
  }

  return (
    <div className="flex-none flex items-center px-2 border-b">
      <Button size="sm" className="mr-2" onClick={handleRunSQL}>
        <PlayIcon className="mr-2 h-4 w-4" />
        Run
      </Button>
      <DarkModeToggle />
      <Button variant="ghost" size="icon">
        <a href="https://github.com/tidbcloud/tisqleditor" target="_blank">
          <GitHubLogoIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
