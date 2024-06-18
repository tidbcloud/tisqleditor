import { useMemo } from 'react'
import { EditorView, placeholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { SQLEditor } from '@tidbcloud/tisqleditor-react'
import { useFilesContext } from '@/contexts/files-context'

export function Editor() {
  const {
    state: { activeFileId, openedFiles }
  } = useFilesContext()

  const activeFile = useMemo(
    () => openedFiles.find((f) => f.id === activeFileId),
    [activeFileId, openedFiles]
  )

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
    />
  )
}
