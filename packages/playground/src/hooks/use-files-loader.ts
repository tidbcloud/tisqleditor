import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useFilesContext } from '@/contexts/files-context'

export function useFilesQuery() {
  const {
    api: { loadFiles }
  } = useFilesContext()

  return useQuery({
    queryKey: ['sql_files'],
    queryFn: loadFiles
  })
}

export function useFilesLoader() {
  const {
    state: { setAllFiles }
  } = useFilesContext()

  const query = useFilesQuery()

  useEffect(() => {
    setAllFiles(query.data ?? [])
  }, [query.data])
}
