type StatementParams = {
  database: string
  sql: string
}

export async function runSQL(params: StatementParams) {
  return fetch(`/api/statement`, {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then((res) => res.json())
    .then((d) => d.data)
}