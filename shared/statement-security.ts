// Both deployments apply the same policy before opening a database connection.
export function validateStatement(
  body: unknown,
  parser: {
    astify(sql: string): unknown
  }
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
    !/^[a-zA-Z0-9_]+$/.test(database) ||
    /^(mysql|information_schema|performance_schema|sys|metrics_schema|inspection_schema|lightning_task_info)$/i.test(
      database
    )
  )
    return deny()
  if (
    typeof sql !== 'string' ||
    !sql.trim() ||
    sql.length > 100000 ||
    /\/\*[!+]/.test(sql)
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
    if (
      node.db != null &&
      String(node.db).toLowerCase() !== database.toLowerCase()
    )
      deny()
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
