import { useMemo, useState } from 'react'
import { EditorView } from '@codemirror/view'

import { SQLEditor } from '@tidbcloud/tisqleditor-react'
import { saveHelper } from '@tidbcloud/codemirror-extension-save-helper'
import { bbedit, oneDark } from '@tidbcloud/codemirror-extension-themes'
import { curSqlGutter } from '@tidbcloud/codemirror-extension-cur-sql-gutter'
import {
  useDbLinter,
  fullWidthCharLinter
} from '@tidbcloud/codemirror-extension-linters'
import { sqlAutoCompletion } from '@tidbcloud/codemirror-extension-sql-autocomplete'
import {
  aiWidget,
  isUnifiedMergeViewActive
} from '@tidbcloud/codemirror-extension-ai-widget'
import {
  onDocChange,
  onSelectionChange,
  SelectionRange
} from '@tidbcloud/codemirror-extension-events'
import { delay } from '@/lib/delay'
import { Extension } from '@codemirror/state'

const DOC_1 = `USE sp500insight;`
const DOC_2 = `-- USE sp500insight;`
const DOC_3 = `-- USE sp500insight；`
const DOC_4 = `
SELECT
  sector,
  industry,
  COUNT(*) AS companies
FROM
  companies c
WHERE
  c.stock_symbol IN (
    SELECT
      stock_symbol
    FROM
      index_compositions
    WHERE
      index_symbol = "SP500"
  )
GROUP BY
  sector,
  industry
ORDER BY
  sector,
  companies DESC;
`

const ALL_EXAMPLES = [
  'ai-widget',
  'save-helper',
  'sql-autocomplete',
  'cur-sql-gutter',
  'use-db-linter',
  'full-width-char-linter'
]

const EXAMPLE_EXTS: { [key: string]: Extension } = {
  'ai-widget': aiWidget({
    chat: async () => {
      await delay(2000)
      return {
        status: 'success',
        message:
          'select * from test;\n-- the data is mocked, replace by your own api when using'
      }
    },
    cancelChat: () => {},
    getDbList: () => {
      return ['test1', 'test2']
    }
  }),
  'save-helper': saveHelper({
    save: (view: EditorView) => {
      console.log('save content:', view.state.doc.toString())
    }
  }),
  'sql-autocomplete': sqlAutoCompletion(),
  'cur-sql-gutter': curSqlGutter({
    whenHide(view) {
      return isUnifiedMergeViewActive(view.state)
    }
  }),
  'use-db-linter': useDbLinter(),
  'full-width-char-linter': fullWidthCharLinter()
}

const THEME_EXTS: { [key: string]: Extension } = {
  light: bbedit,
  bbedit: bbedit,
  dark: oneDark,
  oneDark: oneDark
}

const EXAMPLE_DOCS: { [key: string]: string } = {
  'use-db-linter': DOC_2,
  'full-width-char-linter': DOC_3
}

export function EditorExample({
  example = '',
  theme = '',
  withSelect,
  docChangeHandler,
  selectionChangeHandler
}: {
  example?: string
  withSelect?: string | null
  theme?: string
  docChangeHandler?: (view: EditorView, doc: string) => void
  selectionChangeHandler?: (
    view: EditorView,
    selectRange: SelectionRange[]
  ) => void
}) {
  const exampleArr = useMemo(() => {
    let exampleArr = example.split(',')
    if (exampleArr.includes('all')) {
      exampleArr = ALL_EXAMPLES
    }
    return [...new Set(exampleArr)]
  }, [example])

  const extraExts = useMemo(() => {
    return exampleArr.map((item) => EXAMPLE_EXTS[item]).filter((ex) => !!ex)
  }, [exampleArr])

  const doc = useMemo(() => {
    let str = exampleArr
      .map((item) => EXAMPLE_DOCS[item])
      .filter((s) => !!s)
      .join('\n')
    if (str === '') {
      str = DOC_1
    }
    return [str, DOC_4].join('\n')
  }, [exampleArr])

  const [consoleContent, setConsoleContent] = useState('')

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <SQLEditor
        className="flex-1 overflow-y-auto"
        editorId={example || 'default'}
        doc={doc}
        theme={THEME_EXTS[theme]}
        extraExts={[
          ...extraExts,
          onDocChange((view, content) => {
            docChangeHandler?.(view, content)
            console.log(view)
            setConsoleContent(`SQL changes, current SQLs: \n${content}`)
          }),
          onSelectionChange((view, selectRange) => {
            selectionChangeHandler?.(view, selectRange)
            if (
              selectRange.length === 0 ||
              selectRange[0].from === selectRange[0].to
            ) {
              return
            }

            const content = `Selection changes, from: ${selectRange[0].from} to: ${selectRange[0].to}\nSelect SQLs: ${view.state.sliceDoc(
              selectRange[0].from,
              selectRange[0].to
            )}`
            setConsoleContent(content)
          })
        ]}
      />

      {example === 'events' && withSelect === null && (
        <div className="mt-2 p-2 text-left rounded-xl h-[300px] overflow-y-auto shrink-0">
          <pre>
            <p className="text-sm text-slate-400">{consoleContent}</p>
          </pre>
        </div>
      )}
    </div>
  )
}
