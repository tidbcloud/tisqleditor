const endpoint = process.env.TIDBCLOUD_CHAT2QUERY_APP_URL_ENDPOINT
const publicKey = process.env.TIDBCLOUD_CHAT2QUERY_APP_PUBLIC_KEY
const privateKey = process.env.TIDBCLOUD_CHAT2QUERY_APP_PRIVATE_KEY
const clusterId = process.env.TIDBCLOUD_CHAT2QUERY_CLUSTER_ID
const url = endpoint + '/v3/refineSql'

type RefineSqlReq = {
  database: string
  sql: string
  feedback: string
}

export async function POST(req: Request) {
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
