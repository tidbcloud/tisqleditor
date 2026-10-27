import { SQLEditorInstance } from './editor-instance'

//-------------

export class EditorCache {
  private cache: Map<string, SQLEditorInstance> = new Map()

  addEditor = (editorId: string, editor: SQLEditorInstance) => {
    this.cache.set(editorId, editor)
  }

  getEditor = (editorId: string) => {
    return this.cache.get(editorId)
  }

  deleteEditor = (editorId: string) => {
    const editor = this.cache.get(editorId)
    this.cache.delete(editorId)
    editor?.editorView.destroy()
  }

  clearEditors = () => {
    const editors = [...this.cache.values()]
    this.cache.clear()
    editors.forEach((editor) => editor.editorView.destroy())
  }
}
