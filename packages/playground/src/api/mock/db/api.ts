import { Database } from 'sql.js'
import { execSQL, initDB } from './sqljs'
import { SAMPLE_SQL } from './sample-sql'

let db: Database

export async function runSQL(sql: string): Promise<any> {
  if (!db) {
    db = await initDB(SAMPLE_SQL)
  }
  return execSQL(db, sql)
}
