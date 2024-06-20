import { createContext, useContext } from 'react'
import { SqlStatement } from '@tidbcloud/tisqleditor-extension-sql-parser'

type StatementCtxValue = {
  runStatement: (fileId: string, statements: SqlStatement) => Promise<any>
}

export const StatementContext = createContext<StatementCtxValue | null>(null)

export const useStatementContext = () => {
  const context = useContext(StatementContext)

  if (!context) {
    throw new Error('useStatementContext must be used within a provider')
  }

  return context
}
