import { connect } from '@tidbcloud/serverless'
import {
  audit,
  accessLog,
  readOnlyURL
} from '../../../../../security/db-access'

export async function POST(request: Request) {
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
    const url = readOnlyURL(process.env.READONLY_DATABASE_URL)
    if (body.database !== decodeURIComponent(url.pathname.slice(1))) {
      return respond(403, 'Database access forbidden')
    }
    // Defense in depth only: database grants enforce read-only access.
    if (!/^select\b/i.test(body.sql.trim())) {
      return respond(
        403,
        'Only SELECT statements are available in this playground'
      )
    }
    const conn = connect({ url: url.toString() })
    const result = await audit(requestId, 'statement.query', () =>
      conn.execute(body.sql as string, null, {
        arrayMode: true,
        fullResult: true
      })
    )
    return respond(200, 'ok', result)
  } catch {
    return respond(500, 'Database access failed')
  }
}
