import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { MySQL, sql } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'

import { curSql, getCurStatements } from '..'

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

describe('test getCurStatements', () => {
  let editorView: EditorView = new EditorView()

  beforeAll(() => {
    editorView = new EditorView({
      state: EditorState.create({
        doc: DOC,
        extensions: [sqlParser(), sql({ dialect: MySQL }), curSql()]
      })
    })
  })

  test('select 0 to 0, the firstSqlStatement should to be LINE_1', () => {
    editorView.dispatch({ selection: { anchor: 0, head: 0 } })

    const firstSqlStatement = getCurStatements(editorView.state)
    expect(firstSqlStatement[0].content).toBe(LINE_1)
  })

  test('select from DOC.length to DOC.length, the lastSqlStatement should to be LINE_2', () => {
    editorView.dispatch({
      selection: { anchor: DOC.length, head: DOC.length }
    })

    const lastSqlStatement = getCurStatements(editorView.state)
    expect(lastSqlStatement[0].content).toBe(LINE_2)
  })
})
