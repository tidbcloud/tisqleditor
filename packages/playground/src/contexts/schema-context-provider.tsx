import React, { useMemo } from 'react'
import { SchemaContext, SchemaRes } from './schema-context'
import { getSchema } from '@/api/tidbcloud/schema-api'

export function SchemaProvider(props: { children: React.ReactNode }) {
  const [schema, setSchema] = React.useState<SchemaRes | null>(null)

  const ctxValue = useMemo(
    () => ({ loadSchema: getSchema, schema, setSchema }),
    [schema]
  )

  return (
    <SchemaContext.Provider value={ctxValue}>
      {props.children}
    </SchemaContext.Provider>
  )
}
