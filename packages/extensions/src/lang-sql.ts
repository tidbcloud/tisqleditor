import { MySQL, sql, SQLConfig } from '@codemirror/lang-sql'

export const langSql = (config: SQLConfig) =>
  sql({
    dialect: MySQL,
    upperCaseKeywords: true,
    ...config
  })
