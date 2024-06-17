import {
  MinusIcon,
  Pencil1Icon,
  PlusIcon,
  ReloadIcon
} from '@radix-ui/react-icons'

import dayjs from 'dayjs'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { IFile, useFilesContext } from '@/contexts/files-context'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export default function FilesList() {
  const {
    state: {
      allFiles,
      setAllFiles,
      openedFiles,
      setOpenedFiles,
      activeFileId,
      setActiveFileId
    },
    api: { loadFiles, openFile, addFile, delFile }
  } = useFilesContext()

  const {
    data: filesData,
    isLoading: loadingFiles,
    refetch: refetchFiles
  } = useQuery({
    queryKey: ['files_list'],
    queryFn: loadFiles
  })
  useEffect(() => {
    setAllFiles(filesData ?? [])
  }, [filesData])

  const addFileMut = useMutation({
    mutationFn: handleAddFile
  })
  const delFileMut = useMutation({
    mutationFn: handleDeleteFile
  })

  async function handleOpenFile(file: IFile) {
    setActiveFileId(file.id)

    const opened = openedFiles.find((f) => f.id === file.id)
    if (!opened) {
      setOpenedFiles((pre) => [...pre, { ...file, status: 'loading' }])
      const f = await openFile(file.id)
      setOpenedFiles((pre) => {
        const pos = pre.findIndex((f) => f.id === file.id)
        if (pos >= 0) {
          const next = pre.concat()
          next.splice(pos, 1, { ...f, status: 'loaded' })
          return next
        }
        return pre
      })
    }
  }

  async function handleAddFile() {
    await addFile(`file-${dayjs().format('MMDDHHmmss')}`, '-- use db;')
    await refetchFiles()
  }

  async function handleDeleteFile() {
    if (!activeFileId) {
      return
    }
    await delFile(activeFileId)
    await refetchFiles()
    setActiveFileId(null)
  }

  async function handleRenameFile() {
    // TODO
  }

  return (
    <div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => addFileMut.mutate()}
          disabled={addFileMut.isPending}
        >
          {addFileMut.isPending ? (
            <ReloadIcon className="h-4 w-4 animate-spin" />
          ) : (
            <PlusIcon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleRenameFile}
          disabled={!activeFileId}
        >
          <Pencil1Icon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => delFileMut.mutate()}
          disabled={!activeFileId || delFileMut.isPending}
        >
          {delFileMut.isPending ? (
            <ReloadIcon className="h-4 w-4 animate-spin" />
          ) : (
            <MinusIcon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ul className="mt-4 space-y-1">
        {loadingFiles && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}
        {allFiles.map((f) => (
          <li key={f.id}>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 data-[current]:bg-gray-100"
              data-current={activeFileId === f.id || undefined}
              onClick={() => handleOpenFile(f)}
              title={f.name}
            >
              {f.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
