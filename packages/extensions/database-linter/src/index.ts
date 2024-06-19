import { linter, Diagnostic } from '@codemirror/lint'

import { getSqlStatements } from '@tidbcloud/tisqleditor-extension-sql-parser'
import {
  hintEle,
  linterBaseTheme
} from '@tidbcloud/tisqleditor-extension-grammer-linter'

export type DBLinterOptions = {
  level?: 'error' | 'warning'
  title?: string
  message?: string
  preCheck?: () => string
}

const databaseLinter = (config: DBLinterOptions) =>
  linter((view) => {
    const diagnostics: Diagnostic[] = []

    if (config.preCheck && config.preCheck()) {
      return diagnostics
    }

    getSqlStatements(view.state).forEach((statement) => {
      if (statement.database === '' && statement.type !== 'ddl') {
        diagnostics.push({
          from: statement.from,
          to: statement.to,
          severity: config.level || 'warning',
          message: '',
          renderMessage: () => {
            return hintEle(
              config.title || '',
              config.message ||
                'No database selected by using `USE {database}` statement, this statement may run failed.'
            )
          }
        })
      }
    })

    return diagnostics
  })

export function dbLinter(config: DBLinterOptions) {
  return [databaseLinter(config), linterBaseTheme]
}
