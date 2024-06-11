import { MySQL, sql, SQLConfig } from '@codemirror/lang-sql'
import { LanguageSupport } from '@codemirror/language'

export const langSql = (config: SQLConfig): LanguageSupport =>
  sql({
    dialect: MySQL,
    upperCaseKeywords: true,
    ...config
  })
