import { createContext, useContext, useEffect, useRef } from 'react'
import { EditorCache } from '@tidbcloud/tisqleditor'

type EditorCacheCtxValue = EditorCache

const EditorCacheContext = createContext<EditorCacheCtxValue | null>(null)

export const useEditorCacheContext = () => {
  const context = useContext(EditorCacheContext)
  const cacheRef = useRef<EditorCache>(new EditorCache())

  useEffect(() => {
    return () => {
      cacheRef.current.clearEditors()
    }
  }, [])

  // if you don't need to edit multiple SQL files,
  // then you don't need to use EditorCacheProvider in the top
  if (!context) {
    // throw new Error('useEditorCacheContext must be used within a provider')
    console.warn(
      `useEditorCacheContext: no find EditorCacheProvider, so the cache is not shared, can't support multiple CodeMirror instances`
    )
    return cacheRef.current
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
