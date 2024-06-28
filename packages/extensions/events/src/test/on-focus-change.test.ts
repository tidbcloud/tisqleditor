import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { MySQL, sql } from '@codemirror/lang-sql'
import {
  sqlParser,
  SqlStatement
} from '@tidbcloud/codemirror-extension-sql-parser'
import { curSql } from '@tidbcloud/codemirror-extension-cur-sql'

import { onFocusChange } from '..'

jest.useFakeTimers()

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

test('test focuse change event', async () => {
  let sqlStatement: SqlStatement[] = []

  const editorView = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        sqlParser(),
        sql({ dialect: MySQL }),
        curSql(),
        onFocusChange((sql) => {
          sqlStatement = sql
        })
      ]
    })
  })

  editorView.dispatch({ changes: { from: 0, insert: DOC } })

  editorView.dispatch({ selection: { anchor: 0, head: 0 } })
  await jest.advanceTimersByTime(100)
  expect(sqlStatement.length).toBe(1)
  expect(sqlStatement[0].content).toBe(LINE_1)

  editorView.dispatch({ selection: { anchor: DOC.length, head: DOC.length } })
  await jest.advanceTimersByTime(100)
  expect(sqlStatement.length).toBe(1)
  expect(sqlStatement[0].content).toBe(LINE_2)
})
