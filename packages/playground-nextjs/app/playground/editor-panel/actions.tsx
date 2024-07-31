'use client'

import Link from 'next/link'
import { GithubIcon, PlayIcon, RotateCwIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

import { useEditorCacheContext } from '@tidbcloud/tisqleditor-react'
import { SqlStatement } from '@tidbcloud/codemirror-extension-sql-parser'

import { ModeToggle } from '@/components/biz/theme-toggle'
import { Button } from '@/components/ui/button'
import { useFilesContext } from '@/contexts/files-context'
import { useStatementContext } from '@/contexts/statement-context'

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

    let targetStatement: SqlStatement | undefined
    const curStatements = activeEditor.getCurStatements()
    if (curStatements[0].content === '') {
      targetStatement = activeEditor.getNearbyStatement()
    } else {
      targetStatement = curStatements.at(-1)
    }

    if (targetStatement) {
      setRunResult({ statement: targetStatement.content, status: 'running' })
      try {
        const res = await runStatement(activeFileId, targetStatement)
        console.log('res:', res)
        setRunResult(res)
      } catch (error: any) {
        console.log('error:', error)
        setRunResult({
          statement: targetStatement.content,
          status: 'error',
          message: error.message ?? 'unknown error'
        })
      }
    }
  }

  const runSQLMut = useMutation({
    mutationFn: handleRunSQL
  })

  return (
    <div className="flex-none flex items-center px-2 border-b">
      <Button
        size="sm"
        className="mr-2 dark:text-foreground"
        onClick={() => runSQLMut.mutate()}
        disabled={runSQLMut.isPending}
      >
        {runSQLMut.isPending ? (
          <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <PlayIcon className="mr-2 h-4 w-4" />
        )}
        Run
      </Button>
      <Button variant="outline" size="sm" className="mr-2">
        <Link href="/examples">Examples</Link>
      </Button>
      <ModeToggle />
      <Button variant="ghost" size="icon">
        <a href="https://github.com/tidbcloud/tisqleditor" target="_blank">
          <GithubIcon className="h-4 w-4" />
        </a>
      </Button>
    </div>
  )
}
