import type { Config, Context } from '@netlify/edge-functions'
import { connect } from 'https://esm.sh/@tidbcloud/serverless'

type StatementReq = {
  database: string
  sql: string
}

export default async (req: Request, _context: Context) => {
  const body: StatementReq = await req.json()

  // url:
  // mysql://[user]:[pwd]@[host]/
  // database is skipped and its default value is `test`
  const conn = connect({
    url: Netlify.env.get('TIDBCLOUD_DATABASE_URL') + body.database
  })

  if (body.sql.trim().toLowerCase().startsWith('select')) {
    const res = await conn.execute(body.sql, null, {
      arrayMode: true,
      fullResult: true
    })

    return new Response(JSON.stringify({ code: 200, message: 'ok', data: res }))
  } else {
    return new Response(
      JSON.stringify({
        code: 403,
        message:
          'forbidden, only select statement is available to run in this playground',
        data: {}
      }),
      { status: 403 }
    )
  }
}

export const config: Config = { path: '/api/statement' }
