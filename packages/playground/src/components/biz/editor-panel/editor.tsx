import { useMemo } from 'react'
import { EditorView, placeholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { SQLConfig } from '@codemirror/lang-sql'

import { SQLEditor } from '@tidbcloud/tisqleditor-react'
import { saveHelper } from '@tidbcloud/tisqleditor-extension-save-helper'
import { light, dark } from '@tidbcloud/tisqleditor-extension-themes'
import { curSqlGutter } from '@tidbcloud/tisqleditor-extension-cur-sql-gutter'
import {
  useDbLinter,
  fullWidthCharLinter
} from '@tidbcloud/tisqleditor-extension-linters'
import { autoCompletion } from '@tidbcloud/tisqleditor-extension-autocomplete'

import { useFilesContext } from '@/contexts/files-context'
import { useTheme } from '@/components/darkmode-toggle/theme-provider'
import { SchemaRes, useSchemaContext } from '@/contexts/schema-context'

function convertSchemaToSQLConfig(dbList: SchemaRes): SQLConfig {
  const schema: any = {}
  const tables: any[] = []

  dbList.forEach((d) => {
    const db = d.name
    tables.push({
      label: db,
      type: 'database'
    })
    d.tables.forEach((t: any) => {
      const table = t.name
      tables.push({ label: table, type: 'table' })

      const columns = t.columns.map((c: any) => ({
        label: c.col,
        type: c.data_type
      }))
      tables.push(...columns)

      schema[`${db}.${table}`] = columns
      schema[table] = columns
    })
  })

  return { schema, tables }
}

export function Editor() {
  const {
    api: { saveFile },
    state: { activeFileId, openedFiles }
  } = useFilesContext()

  const { isDark } = useTheme()

  const { schema } = useSchemaContext()
  const sqlConfig = useMemo(
    () => convertSchemaToSQLConfig(schema ?? []),
    [schema]
  )

  const activeFile = useMemo(
    () => openedFiles.find((f) => f.id === activeFileId),
    [activeFileId, openedFiles]
  )

  const extraExts = useMemo(() => {
    if (activeFile && activeFile.status === 'loaded') {
      return [
        saveHelper({
          save: (view: EditorView) => {
            saveFile(activeFile.id, view.state.doc.toString())
          }
        }),
        autoCompletion(),
        curSqlGutter({
          whenHide: (_view) => {
            return false
          }
        }),
        useDbLinter({
          whenDisable: (_view) => {
            return false
          }
        }),
        fullWidthCharLinter()
      ]
    }
    return []
  }, [activeFile])

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TiSQLEditor
        </h1>
      </div>
    )
  }

  if (activeFile.status === 'loading') {
    return (
      <SQLEditor
        className="h-full"
        editorId="loading"
        doc=""
        theme={isDark ? dark : light}
        extraExts={[
          placeholder('loading...'),
          // both needed to prevent user from typing
          EditorView.editable.of(false),
          EditorState.readOnly.of(true)
        ]}
      />
    )
  }

  return (
    <SQLEditor
      className="h-full"
      editorId={activeFile.id}
      doc={activeFile.content}
      sqlConfig={sqlConfig}
      theme={isDark ? dark : light}
      extraExts={extraExts}
    />
  )
}
