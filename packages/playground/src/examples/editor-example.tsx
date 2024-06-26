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
import { aiWidget } from '@tidbcloud/codemirror-extension-ai-widget'
import { delay } from '@/lib/delay'

const EXAMPLE_SQL = `
USE sp500insight;

SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;
`

const ALL_EXAMPLES = [
  'ai-widget',
  'save-helper',
  'autocomplete',
  'cur-sql-gutter',
  'use-db-linter',
  'full-width-char-linter'
]

export function EditorExample({
  example = '',
  isDark = false
}: {
  example?: string
  isDark?: boolean
}) {
  const extraExts = useMemo(() => {
    let exampleArr = example.split(',')
    if (exampleArr.includes('all')) {
      exampleArr = ALL_EXAMPLES
    } else if (exampleArr.includes('linters')) {
      exampleArr = exampleArr.concat([
        'use-db-linter',
        'full-width-char-linter'
      ])
    }
    exampleArr = [...new Set(exampleArr)]

    return exampleArr.map((item) => {
      if (item === 'ai-widget') {
        return aiWidget({
          chat: async () => {
            await delay(2000)
            return { status: 'success', message: 'select * from test;' }
          },
          cancelChat: () => {},
          getDbList: () => {
            return ['test1', 'test2']
          }
        })
      }
      if (item === 'save-helper') {
        return saveHelper({
          save: (view: EditorView) => {
            console.log('save content:', view.state.doc.toString())
          }
        })
      }
      if (item === 'autocomplete') {
        return autoCompletion()
      }
      if (item === 'cur-sql-gutter') {
        return curSqlGutter()
      }
      if (item === 'use-db-linter') {
        return useDbLinter()
      }
      if (item === 'full-width-char-linter') {
        return fullWidthCharLinter()
      }
      return []
    })
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
