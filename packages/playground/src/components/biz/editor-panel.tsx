import { SQLEditor } from '@tidbcloud/tisqleditor-react'

export function EditorPanel() {
  return <SQLEditor className="h-full" editorId="loading" doc="-- use {db};" />
}
