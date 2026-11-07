type Row = Record<string, any>
type Query = (sql: string, params: string[]) => Promise<Row[]>

// Query only configured databases; never enumerate all databases on the cluster.
export async function readSchema(databases: string[], query: Query) {
  const schema = []
  for (const database of [...new Set(databases)].sort()) {
    const tables = await query(
      'SELECT TABLE_NAME AS name FROM information_schema.tables WHERE table_schema = ? ORDER BY TABLE_NAME',
      [database]
    )
    const result = []
    for (const table of tables) {
      const columns = await query(
        'SELECT COLUMN_NAME AS col, DATA_TYPE AS data_type, IS_NULLABLE AS is_nullable FROM information_schema.columns WHERE table_schema = ? AND table_name = ? ORDER BY ORDINAL_POSITION',
        [database, table.name]
      )
      result.push({
        name: table.name,
        columns: columns.map((column) => ({
          col: column.col,
          data_type: column.data_type,
          nullable: column.is_nullable === 'YES'
        }))
      })
    }
    schema.push({ name: database, tables: result })
  }
  return schema
}
