import { createContext, useContext } from 'react'

export type SchemaRes = {
  name: string
  tables: {
    name: string
    columns: {
      col: string
      data_type: string
      nullable: boolean
    }[]
  }[]
}[]

type SchemaCtxValue = {
  // api
  loadSchema: () => Promise<SchemaRes>

  // state
  schema: SchemaRes | null
  setSchema: (schema: SchemaRes | null) => void
}

export const SchemaContext = createContext<SchemaCtxValue | null>(null)

export const useSchemaContext = () => {
  const context = useContext(SchemaContext)

  if (!context) {
    throw new Error('useSchemaContext must be used within a provider')
  }

  return context
}
