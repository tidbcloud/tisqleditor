// This public playground authorizes reads of one configured demo database.
// Database grants remain required, including for views and stored objects.
const allowedTypes = new Set([
  'select',
  'column_ref',
  'binary_expr',
  'unary_expr',
  'number',
  'single_quote_string',
  'double_quote_string',
  'bool',
  'null',
  'star',
  'expr_list',
  'aggr_func',
  'function',
  'default',
  'cast',
  'case',
  'when',
  'extract',
  'interval',
  'date',
  'timestamp'
])
const allowedFunctions = new Set([
  'ABS',
  'AVG',
  'CEIL',
  'CEILING',
  'COALESCE',
  'CONCAT',
  'CONCAT_WS',
  'COUNT',
  'DATE',
  'DATEDIFF',
  'DATE_FORMAT',
  'DAY',
  'FLOOR',
  'IF',
  'IFNULL',
  'LENGTH',
  'LOWER',
  'LTRIM',
  'MAX',
  'MIN',
  'MONTH',
  'NULLIF',
  'REPLACE',
  'ROUND',
  'RTRIM',
  'SUBSTR',
  'SUBSTRING',
  'SUM',
  'TRIM',
  'UPPER',
  'YEAR',
  'ROW_NUMBER',
  'RANK',
  'DENSE_RANK'
])

export function assertAllowedStatement(ast: unknown, database: string) {
  const statements = Array.isArray(ast) ? ast : [ast]
  if (statements.length !== 1 || statements[0]?.type !== 'select') {
    throw new Error('Only a single SELECT is allowed')
  }
  let nodes = 0
  function visit(value: unknown, depth = 0) {
    if (++nodes > 10000 || depth > 100) throw new Error('Query is too complex')
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1))
      return
    }
    if (!value || typeof value !== 'object') return
    const node = value as Record<string, unknown>
    if (typeof node.type === 'string' && !allowedTypes.has(node.type)) {
      throw new Error('Unsupported SQL expression')
    }
    // Covers qualified tables and columns in every nested query.
    if (node.db != null && node.db !== database) {
      throw new Error('Cross-database access is forbidden')
    }
    if (node.schema != null) throw new Error('Qualified routines are forbidden')
    if (node.type === 'select') {
      const into = node.into as Record<string, unknown> | null
      if (into?.position || node.locking_read || node.options) {
        throw new Error('SELECT side effects are forbidden')
      }
    }
    if (node.type === 'function' || node.type === 'aggr_func') {
      const name = node.name
      let functionName: unknown = name
      if (name && typeof name === 'object') {
        const parts = (name as { name?: { value?: unknown }[] }).name
        functionName = parts?.length === 1 ? parts[0].value : undefined
      }
      if (
        typeof functionName !== 'string' ||
        !allowedFunctions.has(functionName.toUpperCase())
      ) {
        throw new Error('Function is not allowed')
      }
    }
    Object.values(node).forEach((child) => visit(child, depth + 1))
  }
  visit(statements[0])
}
