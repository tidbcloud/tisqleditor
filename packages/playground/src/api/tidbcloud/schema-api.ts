import { SchemaRes } from '@/contexts/schema-context'

export async function getSchema(): Promise<SchemaRes> {
  return fetch(`/api/schema`)
    .then((res) => res.json())
    .then((d) => d.data)
}
