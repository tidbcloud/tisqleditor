import { Parser } from 'https://esm.sh/node-sql-parser@5.3.8'
import {
  validateStatement,
  statementAuthorized
} from '../../shared/statement-security.ts'
import { connect } from 'https://esm.sh/@tidbcloud/serverless'
import type { Config, Context } from '@netlify/edge-functions'

const parser = new Parser()

export default async (request: Request, _context: Context) => {
  if (!statementAuthorized(request, Netlify.env.get('STATEMENT_API_TOKEN'))) {
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
  const url = new URL(Netlify.env.get('TIDBCLOUD_DATABASE_URL')!)
  url.pathname = '/' + statement.database
  const conn = connect({ url: url.toString() })
  const res = await conn.execute(statement.sql, null, {
    arrayMode: true,
    fullResult: true
  })
  return Response.json({ code: 200, message: 'ok', data: res })
}

export const config: Config = { path: '/api/statement' }
