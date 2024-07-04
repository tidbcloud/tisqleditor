import { EditorState } from '@codemirror/state'
import { MySQL, sql } from '@codemirror/lang-sql'

import {
  sqlParser,
  getSqlStatements,
  getNearbyStatement,
  SqlStatement
} from '..'
import { EditorView } from '@codemirror/view'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;`

const DOC = `\n${LINE_1}\n\n${LINE_2}\n\n`

describe('test getSqlStatements', () => {
  let editorView: EditorView,
    allStatements: SqlStatement[],
    firstStatement: SqlStatement,
    secondStatement: SqlStatement

  beforeAll(() => {
    editorView = new EditorView({
      state: EditorState.create({
        doc: DOC,
        extensions: [sql({ dialect: MySQL }), sqlParser()]
      })
    })

    // dispatch any a transaction to trigger update event for editor
    editorView.dispatch({ selection: { anchor: 0, head: 0 } })
    allStatements = getSqlStatements(editorView.state)
    firstStatement = allStatements[0]
    secondStatement = allStatements[1]
  })

  test('getSqlStatements works well', () => {
    expect(allStatements.length).toBe(2)

    expect(firstStatement.content).toBe(LINE_1)
    expect(firstStatement.database).toBe('sp500insight')
    expect(firstStatement.type).toBe('use')
    expect(firstStatement.from).toBe(1)
    expect(firstStatement.to).toBe(1 + LINE_1.length)
    expect(firstStatement.lineFrom).toBe(2)
    expect(firstStatement.lineTo).toBe(2)

    expect(secondStatement.content).toBe(LINE_2)
    expect(secondStatement.database).toBe('sp500insight')
    expect(secondStatement.type).toBe('other')
    expect(secondStatement.from).toBe(1 + LINE_1.length + 2)
    expect(secondStatement.to).toBe(1 + LINE_1.length + 2 + LINE_2.length)
    expect(secondStatement.lineFrom).toBe(4)
    expect(secondStatement.lineTo).toBe(8)
  })
})

describe('test getNearbyStatement', () => {
  let editorView: EditorView = new EditorView()

  beforeAll(() => {
    editorView = new EditorView({
      state: EditorState.create({
        doc: DOC,
        extensions: [sql({ dialect: MySQL }), sqlParser()]
      })
    })

    // dispatch any a transaction to trigger update event for editor
    editorView.dispatch({ selection: { anchor: 0, head: 0 } })
  })

  test('getNearbyStatement works well', () => {
    expect(getNearbyStatement(editorView.state, 0)?.content).toBe(LINE_1)

    expect(getNearbyStatement(editorView.state, 10)?.content).toBe(LINE_1)

    // 18
    expect(
      getNearbyStatement(editorView.state, 1 + LINE_1.length)?.content
    ).toBe(LINE_1)

    // 19
    expect(
      getNearbyStatement(editorView.state, 1 + LINE_1.length + 1)?.content
    ).toBe(LINE_1)

    // 28
    expect(
      getNearbyStatement(editorView.state, 1 + LINE_1.length + 10)?.content
    ).toBe(LINE_1)

    // 241
    expect(
      getNearbyStatement(
        editorView.state,
        1 + LINE_1.length + 2 + LINE_2.length
      )?.content
    ).toBe(LINE_2)

    // 241
    expect(
      getNearbyStatement(
        editorView.state,
        1 + LINE_1.length + 2 + LINE_2.length
      )?.content
    ).toBe(LINE_2)

    // 243
    expect(
      getNearbyStatement(
        editorView.state,
        1 + LINE_1.length + 2 + LINE_2.length + 2
      )?.content
    ).toBe(LINE_2)
  })
})
