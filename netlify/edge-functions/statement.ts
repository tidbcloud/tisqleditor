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

  //   const res = await conn.execute(`
  // SELECT g.*
  // FROM game_genre gg
  // LEFT JOIN games g ON g.app_id = gg.app_id
  // WHERE gg.genre_id  = 9
  // ORDER BY g.estimated_owners DESC
  // LIMIT 10`)

  const res = await conn.execute(body.sql, null, {
    arrayMode: true,
    fullResult: true
  })

  return new Response(JSON.stringify({ code: 200, message: 'ok', data: res }))
}

export const config: Config = { path: '/api/statement' }
