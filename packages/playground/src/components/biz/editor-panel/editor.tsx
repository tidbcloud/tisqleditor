import { SQLEditor } from '@tidbcloud/tisqleditor-react'

export function Editor() {
  return <SQLEditor className="h-full" editorId="loading" doc="-- use {db};" />
}
