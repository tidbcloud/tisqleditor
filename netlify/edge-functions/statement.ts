import { Parser } from 'https://esm.sh/node-sql-parser@5.3.8'
import { assertAllowedStatement } from '../../security/statement-policy.ts'
import { connect } from 'https://esm.sh/@tidbcloud/serverless'
import { audit, accessLog, readOnlyURL } from '../../security/db-access.ts'

export default async (request: Request) => {
  const requestId = crypto.randomUUID()
  const respond = (status: number, message: string, data: unknown = {}) => {
    accessLog(requestId, 'statement.response', status)
    return new Response(JSON.stringify({ code: status, message, data }), {
      status
    })
  }
  let body: { database?: unknown; sql?: unknown }
  try {
    body = await request.json()
  } catch {
    return respond(400, 'Invalid JSON request')
  }
  if (
    !body ||
    typeof body.database !== 'string' ||
    typeof body.sql !== 'string'
  ) {
    return respond(400, 'database and sql must be strings')
  }
  try {
    const url = readOnlyURL(Netlify.env.get('TIDBCLOUD_READONLY_DATABASE_URL'))
    if (body.database !== decodeURIComponent(url.pathname.slice(1))) {
      return respond(403, 'Database access forbidden')
    }
    let authorizedSQL: string
    try {
      if (body.sql.length > 20000) throw new Error('Query too long')
      const parser = new Parser()
      const ast = parser.astify(body.sql, { database: 'MySQL' })
      assertAllowedStatement(ast, body.database)
      // Execute the validated AST, never the original text or executable comments.
      authorizedSQL = parser.sqlify(ast, { database: 'MySQL' })
    } catch {
      return respond(
        403,
        'Only a single read-only query on the configured demo database is allowed'
      )
    }
    const conn = connect({ url: url.toString() })
    const result = await audit(requestId, 'statement.query', () =>
      conn.execute(authorizedSQL, null, {
        arrayMode: true,
        fullResult: true
      })
    )
    return respond(200, 'ok', result)
  } catch {
    return respond(500, 'Database access failed')
  }
}

export const config = { path: '/api/statement' }
