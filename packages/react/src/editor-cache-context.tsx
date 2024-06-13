import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { EditorCache } from '@tidbcloud/tisqleditor'

type EditorCacheCtxValue = {
  cache: EditorCache

  activeEditorId: string
  setActiveEditorId: (editorId: string) => void
}

const EditorCacheContext = createContext<EditorCacheCtxValue | null>(null)

export const useEditorCacheContext = () => {
  const context = useContext(EditorCacheContext)

  if (!context) {
    throw new Error('useEditorCacheContext must be used within a provider')
  }

  return context
}

export function EditorCacheProvider(props: { children: React.ReactNode }) {
  const [activeEditorId, setActiveEditorId] = useState('')
  const cache = useMemo(() => new EditorCache(), [])
  const ctxValue = useMemo(
    () => ({
      cache,
      activeEditorId,
      setActiveEditorId
    }),
    [activeEditorId]
  )

  useEffect(() => {
    return () => {
      cache.clearEditors()
    }
  }, [])

  return (
    <EditorCacheContext.Provider value={ctxValue}>
      {props.children}
    </EditorCacheContext.Provider>
  )
}
