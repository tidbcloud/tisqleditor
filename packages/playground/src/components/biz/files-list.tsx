import { useEffect } from 'react'
import { IFile, useFilesContext } from '@/contexts/files-context'

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
    api: { loadFiles, openFile }
  } = useFilesContext()

  // TODO: use react-query in production
  useEffect(() => {
    loadFiles().then((files) => {
      setAllFiles(files)
    })
  }, [])

  async function handleOpenFile(ev: any, file: IFile) {
    ev.preventDefault()

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

  // TODO: add, delete, rename a file

  return (
    <div>
      <ul className="mt-6 space-y-1">
        {allFiles.map((f) => (
          <li key={f.id}>
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 data-[current]:bg-gray-100"
              data-current={activeFileId === f.id || undefined}
              onClick={(ev) => handleOpenFile(ev, f)}
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
