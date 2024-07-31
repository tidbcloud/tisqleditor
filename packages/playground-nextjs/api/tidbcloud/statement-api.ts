type StatementParams = {
  database: string
  sql: string
}

export async function runSQL(params: StatementParams) {
  return fetch(`/api/statement`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
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
