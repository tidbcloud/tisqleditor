import React, { useMemo } from 'react'

import { getSchema } from '@/api/tidbcloud/schema-api'
import { SchemaContext, SchemaRes } from './schema-context'
import { useSchemaLoader } from '@/hooks/use-schema-loader'

function SchemaLoader() {
  useSchemaLoader()
  return null
}

export function SchemaProvider(props: { children: React.ReactNode }) {
  const [schema, setSchema] = React.useState<SchemaRes | null>(null)

  const ctxValue = useMemo(
    () => ({ loadSchema: getSchema, schema, setSchema }),
    [schema]
  )

  return (
    <SchemaContext.Provider value={ctxValue}>
      <SchemaLoader />
      {props.children}
    </SchemaContext.Provider>
  )
}
