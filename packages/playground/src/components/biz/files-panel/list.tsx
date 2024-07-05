import { useEffect } from 'react'

import { IFile, useFilesContext } from '@/contexts/files-context'
import { Skeleton } from '@/components/ui/skeleton'
import { useFilesQuery } from '@/hooks/use-files-loader'

export function FilesList() {
  const {
    state: {
      allFiles,
      openedFiles,
      setOpenedFiles,
      activeFileId,
      setActiveFileId
    },
    api: { openFile }
  } = useFilesContext()

  const { isLoading } = useFilesQuery()

  useEffect(() => {
    if (activeFileId === null && allFiles.length > 0) {
      handleOpenFile(allFiles[0])
    }
  }, [allFiles, activeFileId])

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

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <ul className="mt-4 space-y-1">
      {allFiles.map((f) => (
        <li key={f.id}>
          <a
            href="#"
            className="block rounded-lg px-2 py-2 text-sm font-medium hover:bg-muted data-[current]:bg-muted"
            data-current={activeFileId === f.id || undefined}
            onClick={() => handleOpenFile(f)}
            title={f.name}
          >
            {f.name}
          </a>
        </li>
      ))}
    </ul>
  )
}
