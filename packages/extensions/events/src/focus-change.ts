import { EditorView, ViewUpdate } from '@codemirror/view'

import { getCurStatements } from '@tidbcloud/tisqleditor-extension-cur-sql'
import { SqlStatement } from '@tidbcloud/tisqleditor-extension-sql-parser'

type FocusChangeHelperOptions = {
  onFocusChange: (curSql: SqlStatement[]) => void
}

const focusChangeHandler = (change: (curSql: SqlStatement[]) => void) => {
  let timer: number | undefined
  let first = true

  return EditorView.updateListener.of((v: ViewUpdate) => {
    if (!v.selectionSet) return

    // debounce
    timer && clearTimeout(timer)
    timer = window.setTimeout(
      () => {
        first && (first = false)

        const { state } = v.view
        change(getCurStatements(state))
      },
      first ? 0 : 100
    )
  })
}

export const focusChangeHelper = ({
  onFocusChange
}: FocusChangeHelperOptions) => {
  return [focusChangeHandler(onFocusChange)]
}
