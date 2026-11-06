import { apiGuard } from '../../../../../shared/api-security'
import { connect } from '@tidbcloud/serverless'
import { statementConfiguration } from '../../../../../shared/statement-security'
import { readSchema } from '../../../../../shared/schema'

export async function GET(req: Request) {
  const denied = apiGuard(
    req,
    process.env.API_TOKEN ?? process.env.STATEMENT_API_TOKEN,
    'GET'
  )
  if (denied) return denied

  let configuration: ReturnType<typeof statementConfiguration>
  try {
    configuration = statementConfiguration(
      process.env.DATABASE_URL,
      process.env.STATEMENT_ALLOWED_DATABASES
    )
  } catch {
    return Response.json(
      {
        code: 503,
        message: 'Database URL or database allowlist is missing or invalid',
        data: {}
      },
      { status: 503 }
    )
  }
  try {
    // Avoid the driver's implicit default database when the URL ends with '/'.
    configuration.url.pathname = '/' + configuration.databases[0]
    const conn = connect({ url: configuration.url.toString() })
    const schema = await readSchema(
      configuration.databases,
      async (sql, params) =>
        (await conn.execute(sql, params)) as Record<string, any>[]
    )
    return Response.json(
      { code: 200, message: 'ok', data: schema },
      { headers: { 'cache-control': 'no-store' } }
    )
  } catch {
    // Do not expose connection strings or driver errors to unauthenticated clients.
    return Response.json(
      {
        code: 502,
        message:
          'Unable to read database schema; check database connectivity and account permissions',
        data: {}
      },
      { status: 502 }
    )
  }
}
