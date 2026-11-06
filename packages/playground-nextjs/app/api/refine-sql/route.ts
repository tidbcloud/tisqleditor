export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (
    typeof body?.database !== 'string' ||
    !body.database.trim() ||
    typeof body?.sql !== 'string' ||
    !body.sql.trim()
  ) {
    return Response.json(
      {
        code: 400,
        msg: 'bad request, database or sql should not empty.',
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
      job_id: 'mock-refine-sql',
      session_id: 'mock-session'
    }
  })
}
