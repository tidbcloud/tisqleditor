import { Parser } from 'node-sql-parser'
import {
  validateStatement,
  statementAuthorized
} from '../../../../../shared/statement-security'
import { connect } from '@tidbcloud/serverless'

const parser = new Parser()

export async function POST(request: Request) {
  if (!statementAuthorized(request, process.env.STATEMENT_API_TOKEN)) {
    return Response.json(
      { code: 401, message: 'Unauthorized', data: {} },
      { status: 401 }
    )
  }
  let statement: { database: string; sql: string }
  try {
    statement = validateStatement(await request.json(), parser)
  } catch {
    return Response.json(
      {
        code: 400,
        message:
          'Only a single read-only query in the selected database is allowed',
        data: {}
      },
      { status: 400 }
    )
  }
  const url = new URL(process.env.DATABASE_URL!)
  url.pathname = '/' + statement.database
  const conn = connect({ url: url.toString() })
  const res = await conn.execute(statement.sql, null, {
    arrayMode: true,
    fullResult: true
  })
  return Response.json({ code: 200, message: 'ok', data: res })
}
