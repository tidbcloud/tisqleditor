import { EditorView, ViewUpdate } from '@codemirror/view'

export interface SelectionRange {
  from: number
  to: number
}

type SelectionChangeHelperOptions = (curSql: SelectionRange[]) => void

const selectionChangeHandler = (change: (curSql: SelectionRange[]) => void) => {
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
        first && (first = false)
        change(
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

export const onSelectionChange = (
  onSelectionChange: SelectionChangeHelperOptions
) => {
  return [selectionChangeHandler(onSelectionChange)]
}
