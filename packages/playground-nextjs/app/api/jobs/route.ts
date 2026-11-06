import { apiGuard } from '../../../../../shared/api-security'
export async function GET(req: Request) {
  const denied = apiGuard(
    req,
    process.env.API_TOKEN ?? process.env.STATEMENT_API_TOKEN,
    'GET'
  )
  if (denied) return denied

  const jobId = new URL(req.url).searchParams.get('job_id')
  if (!jobId) {
    return Response.json(
      { code: 400, msg: 'bad request, job_id is empty', data: {} },
      { status: 400 }
    )
  }

  if (jobId !== 'mock-chat2data' && jobId !== 'mock-refine-sql') {
    return Response.json(
      { code: 404, msg: 'Mock job not found', data: {} },
      { status: 404 }
    )
  }

  // Fixed demo results; no cluster or external service is contacted.
  const result =
    jobId === 'mock-refine-sql'
      ? {
          rewritten_sql:
            'SELECT * FROM `games` ORDER BY `recommendations` DESC LIMIT 10;',
          solution: 'Mock SQL refinement: limit the demo query to 10 results.'
        }
      : {
          sql: 'SELECT * FROM `games` ORDER BY `recommendations` DESC LIMIT 20;',
          sql_error: null
        }

  return Response.json({
    code: 200,
    msg: '',
    result: {
      job_id: jobId,
      status: 'done',
      reason: '',
      ended_at: Math.floor(Date.now() / 1000),
      result
    }
  })
}
