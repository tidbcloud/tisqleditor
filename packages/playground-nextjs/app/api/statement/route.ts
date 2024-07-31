import { connect } from '@tidbcloud/serverless'

type StatementReq = {
  database: string
  sql: string
}

export async function POST(request: Request) {
  const body: StatementReq = await request.json()

  const conn = connect({
    url: process.env.DATABASE_URL + body.database
  })

  if (body.sql.trim().toLowerCase().startsWith('select')) {
    const res = await conn.execute(body.sql, null, {
      arrayMode: true,
      fullResult: true
    })

    return Response.json({
      code: 200,
      message: 'ok',
      data: res
    })
  } else {
    return Response.json(
      {
        code: 403,
        message:
          'forbidden, only select statement is available to run in this playground',
        data: {}
      },
      { status: 403 }
    )
  }
}
