import { FILES } from './files-data'
import { delay } from '@/utils/delay'
import { IFile } from '@/contexts/files-context'
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem
} from '@/utils/env-vars'

const memoryFiles = FILES

export async function loadFiles(): Promise<IFile[]> {
  await delay(1000)

  return memoryFiles.map((file) => ({
    id: file.id,
    name: file.name,
    content: ''
  }))
}

export async function openFile(id: string): Promise<IFile> {
  await delay(1000)

  const f = memoryFiles.find((file) => file.id === id)!

  // replace content from localStorage
  const content = getLocalStorageItem(id)
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
  return newFile
}

export async function delFile(id: string): Promise<void> {
  await delay(2000)

  const index = memoryFiles.findIndex((file) => file.id === id)
  memoryFiles.splice(index, 1)

  // remove from localStorage
  removeLocalStorageItem(id)
}

export async function renameFile(id: string, name: string): Promise<void> {
  await delay(2000)

  const file = memoryFiles.find((file) => file.id === id)
  if (file) {
    file.name = name
  }
}

export async function saveFile(id: string, content: string) {
  await delay(2000)

  const file = memoryFiles.find((file) => file.id === id)

  if (file) {
    file.content = content
  }

  // save to localStorage
  setLocalStorageItem(id, content)
}
