import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { MySQL, sql } from '@codemirror/lang-sql'
import { sqlParser, getSqlStatements, getNearbyStatement } from '../'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;`

const DOC = `\n${LINE_1}\n\n${LINE_2}`

test('test getSqlStatements', () => {
  const editorView = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [sql({ dialect: MySQL }), sqlParser()]
    })
  })

  editorView.dispatch({ changes: { from: 0, insert: DOC } })

  const allStatements = getSqlStatements(editorView.state)
  expect(allStatements.length).toBe(2)

  console.log(JSON.stringify(allStatements))

  const firstStatement = allStatements[0]
  expect(firstStatement.content).toBe(LINE_1)
  expect(firstStatement.database).toBe('sp500insight')
  expect(firstStatement.type).toBe('use')
  expect(firstStatement.from).toBe(1)
  expect(firstStatement.to).toBe(1 + LINE_1.length)
  expect(firstStatement.lineFrom).toBe(2)
  expect(firstStatement.lineTo).toBe(2)

  const secondStatement = allStatements[1]
  expect(secondStatement.content).toBe(LINE_2)
  expect(secondStatement.database).toBe('sp500insight')
  expect(secondStatement.type).toBe('other')
  expect(secondStatement.from).toBe(1 + LINE_1.length + 2)
  expect(secondStatement.to).toBe(1 + LINE_1.length + 2 + LINE_2.length)
  expect(secondStatement.lineFrom).toBe(4)
  expect(secondStatement.lineTo).toBe(8)
})
