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
    this.cache.delete(editorId)
  }

  clearEditors = () => {
    this.cache.clear()
  }
}
