import { useEffect, useMemo, useState } from 'react'
import {
  MinusIcon,
  Pencil1Icon,
  PlusIcon,
  ReloadIcon
} from '@radix-ui/react-icons'
import dayjs from 'dayjs'
import { useMutation, useQuery } from '@tanstack/react-query'

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

function AddFileButton() {
  const {
    api: { loadFiles, addFile }
  } = useFilesContext()

  const { refetch: refetchFiles } = useQuery({
    queryKey: ['files_list'],
    queryFn: loadFiles
  })

  async function handleAddFile() {
    await addFile(`file-${dayjs().format('MMDDHHmmss')}`, '-- use db;')
    await refetchFiles()
  }

  const addFileMut = useMutation({
    mutationFn: handleAddFile
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
    mutationFn: handleRenameFile,
    onSuccess: () => setOpen(false)
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
    mutationFn: handleDeleteFile,
    onSuccess: () => setOpen(false)
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

export function FilesActions() {
  return (
    <div className="flex gap-2">
      <AddFileButton />
      <RenameFileDialog />
      <DelFileAlertDialog />
    </div>
  )
}
