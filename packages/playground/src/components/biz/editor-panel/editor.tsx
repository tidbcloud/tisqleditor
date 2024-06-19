import { useMemo } from 'react'
import { EditorView, placeholder } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { SQLEditor } from '@tidbcloud/tisqleditor-react'
import { saveHelper } from '@tidbcloud/tisqleditor-extension-save-helper'
import { bbedit, oneDark } from '@tidbcloud/tisqleditor-extension-themes'

import { useFilesContext } from '@/contexts/files-context'
import { useTheme } from '@/components/darkmode-toggle/theme-provider'

export function Editor() {
  const {
    api: { saveFile },
    state: { activeFileId, openedFiles }
  } = useFilesContext()

  const { isDark } = useTheme()

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
        })
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
        theme={isDark ? oneDark : bbedit}
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
      theme={isDark ? oneDark : bbedit}
      extraExts={extraExts}
    />
  )
}
