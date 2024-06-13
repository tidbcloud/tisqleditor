import { createContext, useContext, useEffect } from 'react'
import { SQLEditorInstance } from '../editor-instance'

//-------------

class EditorCache {
  cache: Map<string, SQLEditorInstance> = new Map()
  activeEditorId: string = ''

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

  setActiveEditorId(editorId: string) {
    this.activeEditorId = editorId
  }

  getActiveEditor() {
    return this.getEditor(this.activeEditorId)
  }
}

//-------------

type EditorCacheCtxValue = EditorCache

const EditorCacheContext = createContext<EditorCacheCtxValue | null>(null)

export const useEditorCacheContext = () => {
  const context = useContext(EditorCacheContext)

  if (!context) {
    throw new Error('useEditorCacheContext must be used within a provider')
  }

  return context
}

export function EditorCacheProvider(props: { children: React.ReactNode }) {
  const cache = new EditorCache()

  useEffect(() => {
    return () => {
      cache.clearEditors()
    }
  }, [])

  return (
    <EditorCacheContext.Provider value={cache}>
      {props.children}
    </EditorCacheContext.Provider>
  )
}
