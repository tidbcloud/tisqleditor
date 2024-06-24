import React, { useMemo } from 'react'

import { SqlStatement } from '@tidbcloud/codemirror-extension-sql-parser'

import { runSQL } from '@/api/tidbcloud/statement-api'
import { StatementContext } from './statement-context'

export function StatementProvider(props: { children: React.ReactNode }) {
  const [runResult, setRunResult] = React.useState<any>({})

  const runStatement = (_fileId: string, statement: SqlStatement) => {
    return runSQL({ database: statement.database, sql: statement.content })
  }

  const ctxValue = useMemo(
    () => ({ runStatement, runResult, setRunResult }),
    [runStatement, runResult]
  )

  return (
    <StatementContext.Provider value={ctxValue}>
      {props.children}
    </StatementContext.Provider>
  )
}
