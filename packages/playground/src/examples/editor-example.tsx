import { useMemo } from 'react'
import { EditorView } from '@codemirror/view'

import { SQLEditor } from '@tidbcloud/tisqleditor-react'
import { saveHelper } from '@tidbcloud/codemirror-extension-save-helper'
import { bbedit, oneDark } from '@tidbcloud/codemirror-extension-themes'
import { curSqlGutter } from '@tidbcloud/codemirror-extension-cur-sql-gutter'
import {
  useDbLinter,
  fullWidthCharLinter
} from '@tidbcloud/codemirror-extension-linters'
import { autoCompletion } from '@tidbcloud/codemirror-extension-autocomplete'

const EXAMPLE_SQL = `
USE sp500insight;

SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;
`

export function EditorExample({
  example,
  isDark
}: {
  example?: string
  isDark?: boolean
}) {
  const extraExts = useMemo(() => {
    if (example === 'save-helper') {
      return [
        saveHelper({
          save: (view: EditorView) => {
            console.log('save content:', view.state.doc.toString())
          }
        })
      ]
    }
    if (example === 'autocomplete') {
      return [autoCompletion()]
    }
    if (example === 'cur-sql-gutter') {
      return [curSqlGutter()]
    }
    if (example === 'usd-db-linter') {
      return [useDbLinter()]
    }
    if (example === 'full-width-char-linter') {
      return [fullWidthCharLinter()]
    }
    return []
  }, [example])

  return (
    <SQLEditor
      className="h-full"
      editorId={example || 'default'}
      doc={EXAMPLE_SQL}
      theme={isDark ? oneDark : bbedit}
      extraExts={extraExts}
    />
  )
}
