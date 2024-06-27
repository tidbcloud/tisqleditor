import { SchemaRes } from '@/contexts/schema-context'

export async function getSchema(): Promise<SchemaRes> {
  return fetch(`/api/schema`)
    .then((res) => {
      if (res.status >= 400 || res.status < 200) {
        return res.json().then((d) => {
          throw new Error(d.message)
        })
      }
      return res
    })
    .then((res) => res.json())
    .then((d) => d.data)
}
