import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'

import { IFile, useFilesContext } from '@/contexts/files-context'
import { Skeleton } from '@/components/ui/skeleton'

export function FilesList() {
  const {
    state: {
      allFiles,
      setAllFiles,
      openedFiles,
      setOpenedFiles,
      activeFileId,
      setActiveFileId
    },
    api: { loadFiles, openFile }
  } = useFilesContext()

  const { data: filesData, isLoading } = useQuery({
    queryKey: ['sql_files'],
    queryFn: loadFiles
  })
  useEffect(() => {
    setAllFiles(filesData ?? [])
    const params = new URLSearchParams(window.location.search)
    const hidden = params.get('hidden')
    if (!hidden) {
      return
    }
    filesData?.length && handleOpenFile(filesData[0])
  }, [filesData])

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
