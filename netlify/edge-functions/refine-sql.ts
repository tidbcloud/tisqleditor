import type { Config, Context } from '@netlify/edge-functions'

const url =
  Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_URL_ENDPOINT') + '/v3/refineSql'
const publicKey = Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_PUBLIC_KEY')
const privateKey = Netlify.env.get('TIDBCLOUD_CHAT2QUERY_APP_PRIVATE_KEY')
const clusterId = Netlify.env.get('TIDBCLOUD_CHAT2QUERY_CLUSTER_ID')

type RefineSqlReq = {
  database: string
  sql: string
  feedback: string
}

export default async (req: Request, _context: Context) => {
  const body: RefineSqlReq = await req.json()

  if (!body.database || !body.sql) {
    return new Response(
      JSON.stringify({
        code: 400,
        message: 'bad request, database or sql should not empty.',
        data: {}
      }),
      { status: 400 }
    )
  }

  const data = {
    cluster_id: clusterId,
    ...body
  }

  // const data = {
  //   cluster_id: clusterId,
  //   database: 'game',
  //   sql: 'SELECT * FROM `games` ORDER BY `recommendations` DESC LIMIT 20;',
  //   feedback: 'limit 10'
  // }

  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa(`${publicKey}:${privateKey}`)
    },
    body: JSON.stringify(data)
  }

  let statusCode = 200
  const res = await fetch(url, fetchOptions).then((res) => {
    console.log(res.status)
    statusCode = res.status
    return res.json()
  })

  return new Response(JSON.stringify(res), { status: statusCode })
}

export const config: Config = { path: '/api/refineSql' }
