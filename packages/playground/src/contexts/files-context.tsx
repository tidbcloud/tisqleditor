import { createContext, useContext } from 'react'

export interface IFile {
  id: string
  name: string
  content: string
  status?: 'loading' | 'loaded'
}

interface IFilesAPI {
  loadFiles(): Promise<IFile[]> // only return id and name, content is empty
  openFile(id: string): Promise<IFile> // return id, name and content
  addFile(name: string, content?: string): Promise<IFile>
  delFile(id: string): Promise<void>
  renameFile(id: string, name: string): Promise<void>
  saveFile(id: string, content: string): Promise<void>
}

interface IFilesState {
  allFiles: IFile[] // file content is empty
  setAllFiles: (files: IFile[] | ((prevState: IFile[]) => IFile[])) => void

  openedFiles: IFile[] // file content is not empty
  setOpenedFiles: (files: IFile[] | ((prevState: IFile[]) => IFile[])) => void

  activeFileId: string | null
  setActiveFileId: (id: string | null) => void
}

type FilesCtxValue = {
  api: IFilesAPI
  state: IFilesState
}

export const FilesContext = createContext<FilesCtxValue | null>(null)

export const useFilesContext = () => {
  const context = useContext(FilesContext)

  if (!context) {
    throw new Error('useFilesContext must be used within a provider')
  }

  return context
}
