import {
  audit,
  accessLog,
  readOnlyURL
} from '../../../../../security/db-access'
import { connect } from '@tidbcloud/serverless'

type SchemaRes = {
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

export async function GET() {
  const requestId = crypto.randomUUID()
  try {
    const url = readOnlyURL(process.env.READONLY_DATABASE_URL)
    const conn = connect({ url: url.toString() })
    const execute = (...args: Parameters<typeof conn.execute>) =>
      audit(requestId, 'schema.query', () => conn.execute(...args))
    const schema: SchemaRes = [
      { name: decodeURIComponent(url.pathname.slice(1)), tables: [] }
    ]

    // step 2: get tables for each db
    for (let i = 0; i < schema.length; i++) {
      const db = schema[i]
      const tables = await execute(
        `
SELECT
  TABLE_NAME as name
FROM
  information_schema.tables
WHERE
  table_schema = ?
ORDER BY
  name ASC`,
        [db.name]
      )
      db.tables = (tables as any[]).map((t) => ({ ...t, columns: [] }))

      // step 3: get columns for each table
      for (let j = 0; j < db.tables.length; j++) {
        const table = db.tables[j]

        const columns = await execute(
          `
SELECT
  COLUMN_NAME as col, DATA_TYPE as data_type, IS_NULLABLE as is_nullable
FROM 
  information_schema.columns
WHERE 
  table_schema = ? AND table_name = ?
ORDER BY
  col ASC`,
          [db.name, table.name]
        )
        table.columns = (columns as any[]).map((c) => ({
          col: c.col,
          data_type: c.data_type,
          nullable: c.is_nullable === 'YES'
        }))
      }
    }
    return Response.json(
      { code: 200, message: 'ok', data: schema },
      {
        headers: {
          'cache-control': 'no-store'
        }
      }
    )
  } catch {
    accessLog(requestId, 'schema.response', 500)
    return new Response(
      JSON.stringify({
        code: 500,
        message: 'Database access failed',
        data: {}
      }),
      { status: 500 }
    )
  }
}
