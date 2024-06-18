import { SQLEditor } from '@tidbcloud/tisqleditor-react'

export function EditorPanel() {
  return (
    <div>
      <SQLEditor editorId="loading" doc="-- use {db};" />
    </div>
  )
}
