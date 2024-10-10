import { EditorState, Extension } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'

type DocChangeHandler = (view: EditorView, state: EditorState, content: string) => void

const docChangeListener = (handler: DocChangeHandler) => {
  return EditorView.updateListener.of((update: ViewUpdate) => {
    if (!update.docChanged) return

    const { state } = update.view
    handler(update.view, update.state, state.doc.sliceString(0))
  })
}

export function onDocChange(handler: DocChangeHandler): Extension {
  return docChangeListener(handler)
}
