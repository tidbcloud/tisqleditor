import { useEffect, useLayoutEffect, useRef } from 'react'

import { useEditorCacheContext } from './editor-cache-context'
import {
  CreateSQLEditorOptions,
  createSQLEditorInstance
} from '../editor-instance'

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
    cacheCtx.getEditor(editorId)?.changeTheme(theme ?? [])
  }, [editorId, theme])

  useEffect(() => {
    cacheCtx.getEditor(editorId)?.changeSQLConfig(sqlConfig ?? {})
  }, [editorId, sqlConfig])

  return <div className={className} ref={editorContainerRef} />
}
