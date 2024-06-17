import { useEffect, useMemo, useState } from 'react'
import {
  MinusIcon,
  Pencil1Icon,
  PlusIcon,
  ReloadIcon
} from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { useMutation, useQuery } from '@tanstack/react-query'

import { IFile, useFilesContext } from '@/contexts/files-context'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

function DelFileAlertDialog() {
  const {
    state: { allFiles, activeFileId, setActiveFileId },
    api: { loadFiles, delFile }
  } = useFilesContext()

  const fileName = useMemo(
    () => allFiles.find((f) => f.id === activeFileId)?.name ?? '',
    [allFiles, activeFileId]
  )

  const { refetch: refetchFiles } = useQuery({
    queryKey: ['files_list'],
    queryFn: loadFiles
  })

  async function handleDeleteFile() {
    if (!activeFileId) {
      return
    }
    await delFile(activeFileId)
    await refetchFiles()
    setActiveFileId(null)
  }

  const delFileMut = useMutation({
    mutationFn: handleDeleteFile
  })

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!activeFileId || delFileMut.isPending}
        >
          {delFileMut.isPending ? (
            <ReloadIcon className="h-4 w-4 animate-spin" />
          ) : (
            <MinusIcon className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete {fileName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your SQL
            file and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => delFileMut.mutate()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RenameFileDialog() {
  const {
    state: { allFiles, activeFileId },
    api: { loadFiles, renameFile }
  } = useFilesContext()

  const oriFileName = useMemo(
    () => allFiles.find((f) => f.id === activeFileId)?.name ?? '',
    [allFiles, activeFileId]
  )
  const [newFileName, setNewFileName] = useState('')
  useEffect(() => {
    setNewFileName(oriFileName)
  }, [oriFileName])

  const { refetch: refetchFiles } = useQuery({
    queryKey: ['files_list'],
    queryFn: loadFiles
  })

  async function handleRenameFile() {
    if (!activeFileId || newFileName === oriFileName) {
      return
    }
    await renameFile(activeFileId, newFileName)
    await refetchFiles()
  }

  const renameFileMut = useMutation({
    mutationFn: handleRenameFile
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!activeFileId || renameFileMut.isPending}
        >
          {renameFileMut.isPending ? (
            <ReloadIcon className="h-4 w-4 animate-spin" />
          ) : (
            <Pencil1Icon className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit SQL file name</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          <Input
            value={newFileName}
            onChange={(ev) => setNewFileName(ev.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              disabled={!newFileName}
              onClick={() => renameFileMut.mutate()}
            >
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
    api: { loadFiles, openFile, addFile }
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

        <RenameFileDialog />
        <DelFileAlertDialog />
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
