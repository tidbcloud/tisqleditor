const validDatabase = (name: string) =>
  /^[a-zA-Z0-9_]{1,64}$/.test(name) &&
  !/^(mysql|information_schema|performance_schema|sys|metrics_schema|inspection_schema|lightning_task_info)$/i.test(
    name
  )

// An empty URL path must never imply access to every database.
export function statementConfiguration(
  connectionString: string | undefined,
  allowedDatabases: string | undefined
): { url: URL; databases: string[] } {
  if (!connectionString) throw new Error('Missing database connection URL')
  const url = new URL(connectionString)
  if (url.protocol !== 'mysql:' || !url.hostname || url.hash)
    throw new Error('Invalid database connection URL')
  const configuredDatabase = decodeURIComponent(url.pathname.slice(1))
  const databases =
    allowedDatabases === undefined
      ? [configuredDatabase]
      : allowedDatabases.split(',').map((name) => name.trim())
  if (!databases.length || !databases.every(validDatabase))
    throw new Error('An explicit database allowlist is required')
  return { url, databases }
}

// Both deployments apply the same policy before opening a database connection.
export function validateStatement(
  body: unknown,
  parser: {
    astify(sql: string): unknown
  },
  allowedDatabases: readonly string[]
): { database: string; sql: string } {
  const deny = () => {
    throw new Error(
      'Only a single read-only query in the selected database is allowed'
    )
  }
  if (!body || typeof body !== 'object') return deny()
  const { database, sql } = body as Record<string, unknown>
  if (
    typeof database !== 'string' ||
    !validDatabase(database) ||
    !allowedDatabases.includes(database)
  )
    return deny()
  if (
    typeof sql !== 'string' ||
    !sql.trim() ||
    sql.length > 100000 ||
    /\/\*/.test(sql)
  )
    return deny()
  let ast: any
  try {
    ast = parser.astify(sql)
  } catch {
    return deny()
  }
  if (Array.isArray(ast)) {
    if (ast.length !== 1) return deny()
    ast = ast[0]
  }
  if (ast?.type !== 'select') return deny()
  const functions = new Set([
    'abs',
    'avg',
    'ceil',
    'ceiling',
    'coalesce',
    'concat',
    'concat_ws',
    'count',
    'date',
    'datediff',
    'date_format',
    'day',
    'floor',
    'if',
    'ifnull',
    'length',
    'lower',
    'max',
    'min',
    'month',
    'nullif',
    'round',
    'substring',
    'sum',
    'trim',
    'upper',
    'year'
  ])
  const visit = (node: any): void => {
    if (!node || typeof node !== 'object') return
    if (Array.isArray(node)) {
      node.forEach(visit)
      return
    }
    if (
      node.type === 'select' &&
      (node.into?.position || node.locking_read || node.options?.length)
    )
      deny()
    if (
      ['insert', 'update', 'delete', 'replace', 'assign', 'var'].includes(
        node.type
      )
    )
      deny()
    // Reject qualified references, including references inside nested queries.
    if (node.db != null && String(node.db) !== database) deny()
    if (node.type === 'function' || node.type === 'aggr_func') {
      const name =
        typeof node.name === 'string'
          ? node.name
          : node.name?.name?.length === 1
            ? node.name.name[0].value
            : ''
      if (!functions.has(String(name).toLowerCase())) deny()
    }
    Object.values(node).forEach(visit)
  }
  visit(ast)
  return { database, sql }
}

export function statementAuthorized(
  request: Request,
  token: string | undefined
): boolean {
  return !!token && request.headers.get('authorization') === `Bearer ${token}`
}
