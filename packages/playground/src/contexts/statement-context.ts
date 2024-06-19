import { createContext, useContext } from 'react'
import { SqlStatement } from '@tidbcloud/tisqleditor-extension-sql-parser'

type StatementCtxValue = {
  runStatement: (fileId: string, statements: SqlStatement) => Promise<any>
}

export const StatementContext = createContext<StatementCtxValue | null>(null)

// StatementContext.Provider is not necessary, so we don't check whether `useContext()` returns null
export const useStatementContext = () => useContext(StatementContext)
