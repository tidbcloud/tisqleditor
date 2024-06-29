import { Extension } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'

export interface SelectionRange {
  from: number
  to: number
}

type SelectionChangeHandler = (
  view: EditorView,
  selRanges: SelectionRange[]
) => void

const selectionChangeListener = (handler: SelectionChangeHandler) => {
  let timer: number | undefined
  let first = true

  return EditorView.updateListener.of((v: ViewUpdate) => {
    if (!v.selectionSet) return

    if (v.startState.selection.eq(v.state.selection)) {
      return
    }

    timer && clearTimeout(timer)
    timer = window.setTimeout(
      () => {
        if (first) {
          first = false
        }
        handler(
          v.view,
          v.state.selection.ranges.map((r) => ({
            from: r.from,
            to: r.to
          }))
        )
      },
      first ? 0 : 100
    )
  })
}

export function onSelectionChange(handler: SelectionChangeHandler): Extension {
  return selectionChangeListener(handler)
}
