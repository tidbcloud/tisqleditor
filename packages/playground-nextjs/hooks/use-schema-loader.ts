import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSchemaContext } from '@/contexts/schema-context'

export function useSchemaQuery() {
  const { loadSchema } = useSchemaContext()

  return useQuery({
    queryKey: ['db_schema'],
    queryFn: loadSchema
  })
}

export function useSchemaLoader() {
  const { setSchema } = useSchemaContext()

  const query = useSchemaQuery()

  useEffect(() => {
    setSchema(query.data ?? null)
  }, [query.data])
}
