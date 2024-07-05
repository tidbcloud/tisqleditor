import { useEffect, useMemo, useState } from 'react'
import {
  MinusIcon,
  Pencil1Icon,
  PlusIcon,
  ReloadIcon
} from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useFilesContext } from '@/contexts/files-context'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useFilesQuery } from '@/hooks/use-files-loader'

function AddFileButton() {
  const {
    state: { setAllFiles },
    api: { addFile }
  } = useFilesContext()

  async function handleAddFile() {
    const f = await addFile(
      `file-${dayjs().format('MMDDHHmmss')}`,
      '-- use {dbName};'
    )
    setAllFiles((pre) => [...pre, { ...f }])
  }

  const queryClient = useQueryClient()
  const addFileMut = useMutation({
    mutationFn: handleAddFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sql_files'] })
    }
  })

  return (
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
  )
}

function RenameFileDialog() {
  const {
    state: { allFiles, setAllFiles, activeFileId, setOpenedFiles },
    api: { renameFile }
  } = useFilesContext()

  const oriFileName = useMemo(
    () => allFiles.find((f) => f.id === activeFileId)?.name ?? '',
    [allFiles, activeFileId]
  )
  const [newFileName, setNewFileName] = useState('')
  useEffect(() => {
    setNewFileName(oriFileName)
  }, [oriFileName])

  async function handleRenameFile() {
    if (!activeFileId || newFileName === oriFileName) {
      return
    }
    await renameFile(activeFileId, newFileName)
    setAllFiles((pre) => {
      const next = [...pre]
      const target = next.find((f) => f.id === activeFileId)
      target!.name = newFileName
      return next
    })
    setOpenedFiles((pre) => {
      const pos = pre.findIndex((f) => f.id === activeFileId)
      if (pos >= 0) {
        const next = [...pre]
        next[pos].name = newFileName
        return next
      }
      return pre
    })
  }

  const queryClient = useQueryClient()
  const renameFileMut = useMutation({
    mutationFn: handleRenameFile,
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['sql_files'] })
    }
  })

  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!activeFileId}
        >
          <Pencil1Icon className="h-4 w-4" />
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
          <Button
            type="submit"
            disabled={!newFileName || renameFileMut.isPending}
            onClick={() => renameFileMut.mutate()}
          >
            {renameFileMut.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DelFileAlertDialog() {
  const {
    state: {
      allFiles,
      setAllFiles,
      activeFileId,
      setActiveFileId,
      openedFiles,
      setOpenedFiles
    },
    api: { delFile }
  } = useFilesContext()

  const fileName = useMemo(
    () => allFiles.find((f) => f.id === activeFileId)?.name ?? '',
    [allFiles, activeFileId]
  )

  async function handleDeleteFile() {
    if (!activeFileId) {
      return
    }
    await delFile(activeFileId)
    setAllFiles((pre) => pre.filter((f) => f.id !== activeFileId))

    const nextOpenedFiles = openedFiles.filter((f) => f.id !== activeFileId)
    setOpenedFiles(nextOpenedFiles)

    setActiveFileId(nextOpenedFiles[0]?.id ?? null)
  }

  const queryClient = useQueryClient()
  const delFileMut = useMutation({
    mutationFn: handleDeleteFile,
    onSuccess: () => {
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: ['sql_files'] })
    }
  })

  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!activeFileId}
        >
          <MinusIcon className="h-4 w-4" />
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

          <Button
            type="submit"
            disabled={delFileMut.isPending}
            onClick={() => delFileMut.mutate()}
          >
            {delFileMut.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function ReloadButton() {
  const { isFetching, refetch } = useFilesQuery()

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => refetch()}
      disabled={isFetching}
    >
      <ReloadIcon className={cn('h-4 w-4', { 'animate-spin': isFetching })} />
    </Button>
  )
}

export function FilesActions() {
  return (
    <div className="flex gap-2 mt-4">
      <AddFileButton />
      <RenameFileDialog />
      <DelFileAlertDialog />
      <ReloadButton />
    </div>
  )
}
