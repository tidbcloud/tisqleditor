import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { EditorCache } from '@tidbcloud/tisqleditor'

type EditorCacheCtxValue = EditorCache

const EditorCacheContext = createContext<EditorCacheCtxValue | null>(null)

export const useEditorCacheContext = () => {
  const context = useContext(EditorCacheContext)
  const [cache] = useState(() => new EditorCache())

  useEffect(() => {
    return () => {
      cache.clearEditors()
    }
  }, [cache])

  // if you don't need to edit multiple SQL files,
  // then you don't need to use EditorCacheProvider in the top
  if (!context) {
    return cache
  }

  return context
}

export function EditorCacheProvider(props: { children: ReactNode }) {
  const [cache] = useState(() => new EditorCache())

  useEffect(() => {
    return () => {
      cache.clearEditors()
    }
  }, [cache])

  return (
    <EditorCacheContext.Provider value={cache}>
      {props.children}
    </EditorCacheContext.Provider>
  )
}
