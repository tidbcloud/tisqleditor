import { FILES } from './files-data'
import { delay } from '@/lib/delay'
import { IFile } from '@/contexts/files-context'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem
} from '@/lib/env-vars'

let memoryFiles = FILES

export async function loadFiles(): Promise<IFile[]> {
  console.log('load files')
  await delay(1000)

  const localFiles = getLocalStorageItem('sql_files')
  if (localFiles) {
    memoryFiles = JSON.parse(localFiles)
  } else {
    setLocalStorageItem('sql_files', JSON.stringify(memoryFiles))
  }
  return memoryFiles.slice()
}

export async function openFile(id: string): Promise<IFile> {
  await delay(1000)

  const f = memoryFiles.find((file) => file.id === id)!

  // replace content from local storage
  const content = getLocalStorageItem(`sql_file.${id}`)
  if (content !== null) {
    f.content = content
  }

  return f
}

export async function addFile(name: string, content?: string): Promise<IFile> {
  await delay(2000)

  const newFile = {
    id: crypto.randomUUID(),
    name,
    content: content ?? ''
  }
  memoryFiles.push(newFile)
  setLocalStorageItem('sql_files', JSON.stringify(memoryFiles))

  return newFile
}

export async function delFile(id: string): Promise<void> {
  await delay(2000)

  const index = memoryFiles.findIndex((file) => file.id === id)
  memoryFiles.splice(index, 1)

  setLocalStorageItem('sql_files', JSON.stringify(memoryFiles))
  removeLocalStorageItem(`sql_file.${id}`)
}

export async function renameFile(id: string, name: string): Promise<void> {
  await delay(2000)

  const file = memoryFiles.find((file) => file.id === id)
  if (file) {
    file.name = name
  }
  setLocalStorageItem('sql_files', JSON.stringify(memoryFiles))
}

export async function saveFile(id: string, content: string) {
  await delay(2000)

  const file = memoryFiles.find((file) => file.id === id)

  if (file) {
    file.content = content
  }
  setLocalStorageItem(`sql_file.${id}`, content)
}
