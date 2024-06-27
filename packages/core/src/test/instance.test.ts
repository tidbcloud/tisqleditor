import { createSQLEditorInstance } from '..'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;`

const DOC = `\n${LINE_1}\n\n${LINE_2}\n\n`

test('editor instance works fine', () => {
  const editorInst = createSQLEditorInstance({
    editorId: '111',
    doc: DOC
  })

  expect(editorInst.editorId).toBe('111')

  editorInst.editorView.dispatch({ selection: { anchor: 0, head: 0 } })

  const allSql = editorInst.getAllStatements()
  expect(allSql.length).toBe(2)
  expect(allSql[0].content).toBe(LINE_1)
  expect(allSql[1].content).toBe(LINE_2)

  let curSql = editorInst.getCurStatements()
  expect(curSql[0].content).toBe('')

  let nearbySql = editorInst.getNearbyStatement()
  expect(nearbySql?.content).toBe(LINE_1)

  editorInst.editorView.dispatch({
    selection: { anchor: 1, head: 2 }
  })

  curSql = editorInst.getCurStatements()
  expect(curSql[0].content).toBe(LINE_1)

  nearbySql = editorInst.getNearbyStatement()
  expect(nearbySql?.content).toBe(LINE_1)

  editorInst.editorView.dispatch({
    selection: { anchor: DOC.length, head: DOC.length }
  })

  curSql = editorInst.getCurStatements()
  expect(curSql[0].content).toBe('')

  nearbySql = editorInst.getNearbyStatement()
  expect(nearbySql?.content).toBe(LINE_2)

  editorInst.editorView.dispatch({
    selection: { anchor: 2, head: 2 + LINE_1.length + 5 }
  })

  curSql = editorInst.getCurStatements()
  expect(curSql.length).toBe(2)
  expect(curSql[0].content).toBe(LINE_1)
  expect(curSql[1].content).toBe(LINE_2)

  nearbySql = editorInst.getNearbyStatement()
  expect(nearbySql?.content).toBe(LINE_1)
})
