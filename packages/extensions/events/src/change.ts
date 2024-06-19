import { EditorView, ViewUpdate } from '@codemirror/view'

type ChangeHelperOptions = {
  onChange: (sql: string, view?: EditorView) => void
}

const changeHandler = (change: (sql: string, view?: EditorView) => void) => {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    if (!update.docChanged) return

    const { state } = update.view
    change(state.doc.sliceString(0), update.view)
  })
}

export const onChange = ({ onChange }: ChangeHelperOptions) => {
  return [changeHandler(onChange)]
}
