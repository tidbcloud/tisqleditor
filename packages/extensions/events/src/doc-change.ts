import { Extension } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'

type DocChangeHandler = (view: EditorView, content: string) => void

const docChangeListener = (handler: DocChangeHandler) => {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    if (!update.docChanged) return

    const { state } = update.view
    handler(update.view, state.doc.sliceString(0))
  })
}

export function onDocChange(handler: DocChangeHandler): Extension {
  return docChangeListener(handler)
}
