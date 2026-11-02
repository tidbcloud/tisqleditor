// Stateless demo responses: no credentials, network requests or database access.
import { createMockJob, ownsMockJob } from '../security/mock-job.ts'
const headers = { 'Cache-Control': 'no-store' }

function invalidRequest(message: string, status = 400) {
  return Response.json(
    { code: status, msg: message, message, data: {} },
    { status, headers }
  )
}

export async function mockChat2Data(req: Request) {
  let body: { database?: unknown; question?: unknown } | null
  try {
    body = await req.json()
  } catch {
    return invalidRequest('bad request, invalid JSON')
  }

  if (
    !body ||
    typeof body.database !== 'string' ||
    !body.database.trim() ||
    typeof body.question !== 'string' ||
    !body.question.trim()
  ) {
    return invalidRequest('bad request, database or question should not empty.')
  }

  const job = await createMockJob(req, 'chat2data')
  return Response.json(
    {
      code: 200,
      msg: '',
      result: {
        cluster_id: 'mock-cluster',
        database: body.database,
        job_id: job.jobId,
        session_id: crypto.randomUUID(),
        mock: true
      }
    },
    { headers: { ...headers, 'Set-Cookie': job.cookie } }
  )
}

export async function mockRefineSql(req: Request) {
  let body: { database?: unknown; sql?: unknown; feedback?: unknown } | null
  try {
    body = await req.json()
  } catch {
    return invalidRequest('bad request, invalid JSON')
  }

  if (
    !body ||
    typeof body.database !== 'string' ||
    !body.database.trim() ||
    typeof body.sql !== 'string' ||
    !body.sql.trim()
  ) {
    return invalidRequest('bad request, database or sql should not empty.')
  }

  const job = await createMockJob(req, 'refine-sql')
  return Response.json(
    {
      code: 200,
      msg: '',
      result: {
        job_id: job.jobId,
        session_id: crypto.randomUUID(),
        mock: true
      }
    },
    { headers: { ...headers, 'Set-Cookie': job.cookie } }
  )
}

export async function mockJobStatus(req: Request) {
  const jobId = new URL(req.url).searchParams.get('job_id')
  if (!jobId) return invalidRequest('bad request, job_id is empty')
  if (!(await ownsMockJob(req, jobId))) {
    console.info(
      JSON.stringify({
        event: 'mock_job_access',
        status: 404,
        timestamp: new Date().toISOString()
      })
    )
    return invalidRequest('mock job not found', 404)
  }

  // Every mock task completes immediately, including across serverless instances.
  return Response.json(
    {
      code: 200,
      msg: '',
      result: {
        ended_at: Math.floor(Date.now() / 1000),
        job_id: jobId,
        reason: '',
        result: jobId.startsWith('mock-refine-sql-')
          ? {
              rewritten_sql:
                '-- Mock refinement; no database query was executed.\nSELECT 1 AS mock_result LIMIT 10;',
              solution:
                'This is a fixed mock refinement and does not process the supplied SQL or feedback.'
            }
          : {
              sql: '-- Mock response; no database query was executed.\nSELECT 1 AS mock_result;',
              sql_error: null
            },
        status: 'done',
        mock: true
      }
    },
    { headers }
  )
}
