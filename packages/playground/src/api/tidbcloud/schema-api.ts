import { SchemaRes } from '@/contexts/schema-context'

export async function getSchema(): Promise<SchemaRes> {
  return fetch(`/api/schemas`)
    .then((res) => res.json())
    .then((d) => d.data)
}
