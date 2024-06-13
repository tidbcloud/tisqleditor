import { useEffect, useLayoutEffect, useRef } from 'react'

import { useEditorCacheContext } from './editor-cache-context'
import {
  CreateSQLEditorOptions,
  createSQLEditorInstance
} from '@tidbcloud/tisqleditor'

type SQLEditorProps = CreateSQLEditorOptions & {
  editorId: string
  className?: string
}

export default function SQLEditor({
  className,
  editorId,
  theme,
  sqlConfig,
  ...rest
}: SQLEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const cacheCtx = useEditorCacheContext()

  useLayoutEffect(() => {
    if (!editorContainerRef.current) return

    let editorInst = cacheCtx.cache.getEditor(editorId)
    if (!editorInst) {
      editorInst = createSQLEditorInstance({
        editorId,
        theme,
        sqlConfig,
        ...rest
      })
      cacheCtx.cache.addEditor(editorId, editorInst)
    }

    editorContainerRef.current.appendChild(editorInst.editorView.dom)
    editorInst.editorView.focus()

    return () => {
      if (editorContainerRef.current && editorInst) {
        editorContainerRef.current.removeChild(editorInst.editorView.dom)
      }
    }
  }, [editorId])

  // use `useLayoutEffect` to avoid flicker
  useLayoutEffect(() => {
    cacheCtx.cache.getEditor(editorId)?.changeTheme(theme ?? [])
  }, [editorId, theme])

  useEffect(() => {
    cacheCtx.cache.getEditor(editorId)?.changeSQLConfig(sqlConfig ?? {})
  }, [editorId, sqlConfig])

  return <div className={className} ref={editorContainerRef} />
}
