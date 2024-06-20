import React from 'react'

import { SqlStatement } from '@tidbcloud/tisqleditor-extension-sql-parser'

import { runSQL } from '@/api/tidbcloud/statement-api'
import { StatementContext } from './statement-context'

export function StatementProvider(props: { children: React.ReactNode }) {
  const runStatement = (_fileId: string, statement: SqlStatement) => {
    return runSQL({ database: statement.database, sql: statement.content })
  }

  return (
    <StatementContext.Provider value={{ runStatement }}>
      {props.children}
    </StatementContext.Provider>
  )
}
