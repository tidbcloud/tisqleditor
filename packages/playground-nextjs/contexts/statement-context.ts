import { createContext, useContext } from 'react'
import { SqlStatement } from '@tidbcloud/codemirror-extension-sql-parser'

type StatementCtxValue = {
  runStatement: (fileId: string, statements: SqlStatement) => Promise<any>

  // state
  runResult: any
  setRunResult: (result: any | ((prev: any) => any)) => void
}

export const StatementContext = createContext<StatementCtxValue | null>(null)

export const useStatementContext = () => {
  const context = useContext(StatementContext)

  if (!context) {
    throw new Error('useStatementContext must be used within a provider')
  }

  return context
}
