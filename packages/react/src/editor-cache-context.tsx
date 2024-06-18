import { createContext, useContext, useEffect, useRef } from 'react'
import { EditorCache } from '@tidbcloud/tisqleditor'

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
  const cacheRef = useRef<EditorCache>(new EditorCache())

  useEffect(() => {
    return () => {
      cacheRef.current.clearEditors()
    }
  }, [])

  return (
    <EditorCacheContext.Provider value={cacheRef.current}>
      {props.children}
    </EditorCacheContext.Provider>
  )
}
