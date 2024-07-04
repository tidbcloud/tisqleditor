import { Cross1Icon } from '@radix-ui/react-icons'

import { useEditorCacheContext } from '@tidbcloud/tisqleditor-react'
import { Button } from '@/components/ui/button'
import { IFile, useFilesContext } from '@/contexts/files-context'

export function OpenedFilesTabs() {
  const {
    api: { saveFile },
    state: { openedFiles, setOpenedFiles, activeFileId, setActiveFileId }
  } = useFilesContext()
  const cacheCtx = useEditorCacheContext()

  function handleCloseFile(file: IFile) {
    const next = openedFiles.filter((f) => f.id !== file.id)
    setOpenedFiles(next)

    // save if changed
    const editorInst = cacheCtx.getEditor(file.id)
    if (editorInst) {
      const editorDoc = editorInst.editorView.state.doc.toString()
      if (editorDoc !== file.content) {
        saveFile(file.id, editorDoc)
      }
    }

    // cleanup
    cacheCtx.deleteEditor(file.id)

    // close active file
    if (activeFileId === file.id) {
      if (next.length > 0) {
        setActiveFileId(next[0].id)
      } else {
        // setActiveFileId(null)
        setActiveFileId('')
      }
    }
  }

  function handleSwitchFile(file: IFile) {
    if (activeFileId === file.id) return

    setActiveFileId(file.id)

    // save pre file if changed
    if (activeFileId) {
      const preFile = openedFiles.find((f) => f.id === activeFileId)
      const editorInst = cacheCtx.getEditor(activeFileId)
      if (preFile && editorInst) {
        const editorDoc = editorInst.editorView.state.doc.toString()
        if (editorDoc !== preFile.content) {
          saveFile(preFile.id, editorDoc)
        }
      }
    }
  }

  return (
    <div className="flex-auto flex items-end overflow-auto">
      {openedFiles.map((f) => (
        <div
          className="h-10 border border-l-0 flex items-center pl-2 pr-1 cursor-pointer group data-[current]:border-b-transparent data-[current]:border-t-2 data-[current]:border-t-cyan-500"
          key={f.id}
          data-current={activeFileId === f.id || undefined}
          onClick={() => handleSwitchFile(f)}
        >
          <p className="text-sm text-muted-foreground max-w-40 truncate">
            {f.name}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1 group-hover:visible invisible"
            onClick={(event) => {
              event.stopPropagation() // prevent handleSwitchFile
              handleCloseFile(f)
            }}
          >
            <Cross1Icon className="h-2 w-2" />
          </Button>
        </div>
      ))}
      <div className="flex-grow border-b"></div>
    </div>
  )
}
