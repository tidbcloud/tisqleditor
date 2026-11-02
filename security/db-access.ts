// Never log credentials, raw SQL, query parameters, or driver error messages.
export function accessLog(
  requestId: string,
  operation: string,
  status: number
) {
  console.info(
    JSON.stringify({
      event: 'database_access',
      timestamp: new Date().toISOString(),
      requestId,
      actor: 'anonymous',
      operation,
      status
    })
  )
}

export function readOnlyURL(value: string | undefined): URL {
  if (!value) throw new Error('Read-only database credentials are required')
  const url = new URL(value)
  if (url.protocol !== 'mysql:' || !url.username || !url.pathname.slice(1)) {
    throw new Error(
      'Read-only database URL must include an account and database'
    )
  }
  const database = decodeURIComponent(url.pathname.slice(1))
  if (
    !/^[a-zA-Z0-9_$-]+$/.test(database) ||
    [
      'mysql',
      'information_schema',
      'performance_schema',
      'sys',
      'metrics_schema',
      'inspection_schema',
      'lightning_task_info'
    ].includes(database.toLowerCase())
  ) {
    throw new Error('A non-system demo database is required')
  }
  return url
}

export async function audit<T>(
  requestId: string,
  operation: string,
  run: () => Promise<T>
): Promise<T> {
  accessLog(requestId, operation + ':attempt', 0)
  try {
    const result = await run()
    accessLog(requestId, operation, 200)
    return result
  } catch {
    accessLog(requestId, operation, 500)
    throw new Error('Database access failed')
  }
}
