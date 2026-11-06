import { connect } from 'https://esm.sh/@tidbcloud/serverless'
import { statementConfiguration } from '../../shared/statement-security.ts'
import { readSchema } from '../../shared/schema.ts'

export default async () => {
  let configuration: ReturnType<typeof statementConfiguration>
  try {
    configuration = statementConfiguration(
      Netlify.env.get('TIDBCLOUD_DATABASE_URL'),
      Netlify.env.get('TIDBCLOUD_STATEMENT_ALLOWED_DATABASES')
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

export const config = { path: '/api/schema' }
