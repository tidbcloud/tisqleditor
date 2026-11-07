import { apiGuard } from '../../shared/api-security.ts'
import type { Config, Context } from '@netlify/edge-functions'

export default async (req: Request, _context: Context) => {
  const denied = apiGuard(
    req,
    Netlify.env.get('TIDBCLOUD_API_TOKEN') ??
      Netlify.env.get('STATEMENT_API_TOKEN'),
    'POST'
  )
  if (denied) return denied

  const body = await req.json().catch(() => null)
  if (
    typeof body?.database !== 'string' ||
    !body.database.trim() ||
    typeof body?.question !== 'string' ||
    !body.question.trim()
  ) {
    return Response.json(
      {
        code: 400,
        msg: 'bad request, database or question should not empty.',
        data: {}
      },
      { status: 400 }
    )
  }

  // The job ID selects a fixed local result in /api/jobs.
  return Response.json({
    code: 200,
    msg: '',
    result: {
      job_id: 'mock-chat2data',
      session_id: 'mock-session'
    }
  })
}

export const config: Config = { path: '/api/chat2data' }
