import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import { linter, Diagnostic } from '@codemirror/lint'

import { getSqlStatements } from '@tidbcloud/codemirror-extension-sql-parser'

import { hintEle, linterBaseTheme } from './lint-style'

export type DBLinterOptions = {
  level?: 'error' | 'warning'
  title?: string
  message?: string
  /* control to disable the lint when some cases happen in run time */
  whenDisable?: (view: EditorView) => boolean
}

const databaseLinter = (config: DBLinterOptions) =>
  linter((view) => {
    const diagnostics: Diagnostic[] = []

    // console.log('diagnostic count:', diagnosticCount(view.state))

    if (config.whenDisable && config.whenDisable(view)) {
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

export function useDbLinter(config: DBLinterOptions = {}): Extension {
  return [databaseLinter(config), linterBaseTheme]
}
