import { useEffect, useMemo, useState } from 'react'
import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'

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
  onSelectionChange
} from '@tidbcloud/codemirror-extension-events'

import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/components/ui/use-toast'
import { useTheme } from '@/components/darkmode-toggle/theme-provider'
import { delay } from '@/lib/delay'
import { setLocalStorageItem } from '@/lib/env-vars'
import { cn } from '@/lib/utils'

const DOC_1 = `USE game;`
const DOC_2 = `-- USE game;`
const DOC_3 = `-- USE game；`
const DOC_4 = `-- press cmd+s to save content`
const DOC_5 = `
SELECT
  name,
  average_playtime_forever
FROM
  games
ORDER BY
  average_playtime_forever DESC
LIMIT
  10;
`

const ALL_EXAMPLES = [
  'ai-widget',
  'sql-autocomplete',
  'cur-sql-gutter',
  'use-db-linter',
  'full-width-char-linter',
  'save-helper',
  'events'
]

const THEME_EXTS: { [key: string]: Extension } = {
  light: bbedit,
  bbedit: bbedit,
  dark: oneDark,
  oneDark: oneDark
}

const EXAMPLE_DOCS: { [key: string]: string } = {
  'use-db-linter': DOC_2,
  'full-width-char-linter': DOC_3,
  'save-helper': DOC_4
}

export function EditorExample({
  example = '',
  theme = '',
  withSelect = false
}: {
  example?: string
  theme?: string
  withSelect?: boolean
}) {
  const { setTheme: setAppTheme } = useTheme()

  useEffect(() => {
    setAppTheme(theme === 'oneDark' || theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  const [output, setOutput] = useState('')

  const { toast } = useToast()

  const exampleArr = useMemo(() => {
    let exampleArr = example.split(',')
    if (exampleArr.includes('all')) {
      exampleArr = ALL_EXAMPLES
    }
    return [...new Set(exampleArr)]
  }, [example])

  useEffect(() => {
    setOutput('')
  }, [exampleArr])

  const showOutputBox = exampleArr.includes('events')

  const exts: { [key: string]: Extension } = useMemo(
    () => ({
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
      'sql-autocomplete': sqlAutoCompletion(),
      'cur-sql-gutter': curSqlGutter({
        whenHide(view) {
          return isUnifiedMergeViewActive(view.state)
        }
      }),
      'use-db-linter': useDbLinter(),
      'full-width-char-linter': fullWidthCharLinter(),
      'save-helper': saveHelper({
        save: (view: EditorView) => {
          toast({ description: 'Doc has saved to local storage.' })
          setLocalStorageItem(
            'example.save_helper.doc',
            view.state.doc.toString()
          )
        }
      }),
      events: [
        onDocChange((_view, _state, content) => {
          const s = `Doc changes, current doc:\n\n${content}`
          console.log(s)
          setOutput(s)
        }),
        onSelectionChange((view, _state, sels) => {
          if (sels.length === 0 || sels[0].from === sels[0].to) {
            return
          }
          const s = `Selection changes, select from ${sels[0].from} to ${sels[0].to}\nSelected content:\n${view.state.sliceDoc(sels[0].from, sels[0].to)}`
          console.log(s)
          setOutput(s)
        })
      ]
    }),
    []
  )

  const extraExts = useMemo(() => {
    return exampleArr.map((item) => exts[item]).filter((ex) => !!ex)
  }, [exampleArr])

  const doc = useMemo(() => {
    let str = exampleArr
      .map((item) => EXAMPLE_DOCS[item])
      .filter((s) => !!s)
      .join('\n')
    if (str === '') {
      str = DOC_1
    }
    return [str, DOC_5].join('\n')
  }, [exampleArr])

  return (
    <div className="h-full flex flex-col">
      <SQLEditor
        className={cn('flex-auto', withSelect && 'border-2 max-h-[400px]')}
        editorId={example || 'default'}
        doc={doc}
        theme={THEME_EXTS[theme]}
        extraExts={extraExts}
      />

      {showOutputBox && (
        <div
          className={cn(
            'h-[200px] p-2 overflow-y-auto shrink-0',
            withSelect ? 'border-2 mt-2' : 'border-t-2'
          )}
        >
          <pre>
            <p className="text-sm text-slate-400">{output}</p>
          </pre>
        </div>
      )}

      <Toaster />
    </div>
  )
}
