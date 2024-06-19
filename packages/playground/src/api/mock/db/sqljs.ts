// this file is copied from https://github.com/liyupi/sql-mother/blob/master/src/core/sqlExecutor.ts
import initSqlJs, { Database, SqlJsStatic } from 'sql.js'

let SQL: SqlJsStatic

export const initDB = async (initSql?: string) => {
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: () => './sql-wasm.wasm'
    })
  }
  const db = new SQL.Database()
  if (initSql) {
    db.run(initSql)
  }
  return db
}

export const execSQL = (db: Database, sql: string) => {
  return db.exec(sql)
}
