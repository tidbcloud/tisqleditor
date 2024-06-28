import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { MySQL, sql } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'
import { curSql } from '@tidbcloud/codemirror-extension-cur-sql'

import { onSelectionChange, SelectionRange } from '..'

jest.useFakeTimers()

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

test('test selection change event', async () => {
  let sqlStatement: SelectionRange[] = []

  const editorView = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        sqlParser(),
        sql({ dialect: MySQL }),
        curSql(),
        onSelectionChange((sql) => {
          sqlStatement = sql
        })
      ]
    })
  })

  editorView.dispatch({ changes: { from: 0, insert: DOC } })

  editorView.dispatch({ selection: { anchor: 0, head: LINE_1.length } })
  await jest.advanceTimersByTime(100)
  expect(sqlStatement[0].from).toBe(0)
  expect(sqlStatement[0].to).toBe(LINE_1.length)

  editorView.dispatch({
    selection: { anchor: LINE_1.length, head: DOC.length }
  })
  await jest.advanceTimersByTime(100)
  expect(sqlStatement[0].from).toBe(LINE_1.length)
  expect(sqlStatement[0].to).toBe(DOC.length)
})
