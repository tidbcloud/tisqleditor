import '@testing-library/jest-dom'

import { createSQLEditorInstance } from '../../../../core'

test('cur sql extension with empty doc', () => {
  const editor = createSQLEditorInstance({
    editorId: 'curSqlTestCodemirror1',
    doc: ``
  })

  const line1 = 'USE game;'
  const line2 = `SELECT
  *
from
  game.all_audio_language
LIMIT
  10;`

  const doc = `${line1}\n${line2}`

  editor.editorView.dispatch({ changes: { from: 0, to: 0, insert: doc } })

  let curSql = editor.getCurStatements()
  expect(curSql[0].content).toBe(line1)

  editor.editorView.dispatch({
    selection: { anchor: doc.length, head: doc.length }
  })
  curSql = editor.getCurStatements()
  expect(curSql[0].content).toBe(line2)

  const allSql = editor.getAllStatements()
  expect(allSql.length).toBe(2)
  expect(allSql[0].content).toBe(line1)
  expect(allSql[1].content).toBe(line2)
})
