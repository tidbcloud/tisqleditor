import { useEffect, useLayoutEffect, useRef } from 'react'

import { useEditorCacheContext } from './editor-cache-context'
import {
  CreateSQLEditorOptions,
  createSQLEditorInstance
} from '@tidbcloud/tisqleditor'

type SQLEditorProps = CreateSQLEditorOptions & {
  className?: string
}

export function SQLEditor({
  className,
  editorId,
  theme,
  sqlConfig,
  ...rest
}: SQLEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const cacheCtx = useEditorCacheContext()

  useLayoutEffect(() => {
    const container = editorContainerRef.current
    if (!container) return

    let editorInst = cacheCtx.getEditor(editorId)
    if (!editorInst) {
      editorInst = createSQLEditorInstance({
        editorId,
        theme,
        sqlConfig,
        ...rest
      })
      cacheCtx.addEditor(editorId, editorInst)
    }

    const editorDOM = editorInst.editorView.dom
    container.appendChild(editorDOM)
    editorInst.editorView.focus()

    return () => {
      if (editorDOM.parentNode === container) {
        container.removeChild(editorDOM)
      }
    }
  }, [cacheCtx, editorId])

  // use `useLayoutEffect` to avoid flicker
  useLayoutEffect(() => {
    cacheCtx.getEditor(editorId)?.changeTheme(theme ?? [])
  }, [cacheCtx, editorId, theme])

  useEffect(() => {
    cacheCtx.getEditor(editorId)?.changeSQLConfig(sqlConfig ?? {})
  }, [cacheCtx, editorId, sqlConfig])

  return <div className={className} ref={editorContainerRef} />
}
