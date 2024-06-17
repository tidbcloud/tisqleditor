import React, { useMemo } from 'react'
import { IFile, FilesContext } from './files-context'
import {
  addFile,
  delFile,
  loadFiles,
  openFile,
  renameFile,
  saveFile
} from '@/api/mock/files-api'

//----------------------------------------------

export function FilesProvider(props: { children: React.ReactNode }) {
  const [allFiles, setAllFiles] = React.useState<IFile[]>([])
  const [openedFiles, setOpenedFiles] = React.useState<IFile[]>([])
  const [activeFileId, setActiveFileId] = React.useState<string | null>(null)

  const ctxValue = useMemo(
    () => ({
      api: {
        loadFiles,
        openFile,
        addFile,
        delFile,
        renameFile,
        saveFile
      },
      state: {
        allFiles,
        setAllFiles,
        openedFiles,
        setOpenedFiles,
        activeFileId,
        setActiveFileId
      }
    }),
    [allFiles, openedFiles, activeFileId]
  )

  return (
    <FilesContext.Provider value={ctxValue}>
      {props.children}
    </FilesContext.Provider>
  )
}
