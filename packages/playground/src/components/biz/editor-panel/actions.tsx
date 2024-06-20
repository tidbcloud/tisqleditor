import { GitHubLogoIcon, PlayIcon, ReloadIcon } from '@radix-ui/react-icons'

import { DarkModeToggle } from '@/components/darkmode-toggle/toggle'
import { Button } from '@/components/ui/button'
import { useFilesContext } from '@/contexts/files-context'
import { useStatementContext } from '@/contexts/statement-context'
import { useEditorCacheContext } from '@tidbcloud/tisqleditor-react'
import { useMutation } from '@tanstack/react-query'

export function EditorActions() {
  const {
    state: { activeFileId }
  } = useFilesContext()
  const { runStatement, setRunResult } = useStatementContext()
  const cacheCtx = useEditorCacheContext()

  async function handleRunSQL() {
    if (activeFileId === null) return

    const activeEditor = cacheCtx.getEditor(activeFileId)
    if (!activeEditor) return

    const curStatements = activeEditor.getCurStatements()
    if (curStatements[0].content === '') return

    const lastStatement = curStatements.at(-1)
    if (lastStatement) {
      setRunResult({ statement: lastStatement.content, status: 'running' })
      const res = await runStatement(activeFileId, lastStatement)
      setRunResult(res)
    }
  }

  const runSQLMut = useMutation({
    mutationFn: handleRunSQL
  })

  return (
    <div className="flex-none flex items-center px-2 border-b">
      <Button
        size="sm"
        className="mr-2"
        onClick={() => runSQLMut.mutate()}
        disabled={runSQLMut.isPending}
      >
        {runSQLMut.isPending ? (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlayIcon className="mr-2 h-4 w-4" />
        )}
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
