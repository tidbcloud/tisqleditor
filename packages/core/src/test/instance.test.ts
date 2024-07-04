import { createSQLEditorInstance } from '..'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT sector, industry, COUNT(*) AS companies
FROM companies c
WHERE c.stock_symbol IN (SELECT stock_symbol FROM index_compositions WHERE index_symbol = "SP500")
GROUP BY sector, industry
ORDER BY sector, companies DESC;`

const DOC = `\n${LINE_1}\n\n${LINE_2}\n\n`

describe('editor instance works fine', () => {
  let editorInst

  beforeAll(() => {
    editorInst = createSQLEditorInstance({
      editorId: '111',
      doc: DOC
    })
  })

  test('editorId should be correct', () =>
    expect(editorInst.editorId).toBe('111'))

  describe('dispatch a empty selection action', () => {
    let curSql, nearbySql, allSql

    beforeAll(() => {
      editorInst.editorView.dispatch({ selection: { anchor: 0, head: 0 } })
      curSql = editorInst.getCurStatements()
      nearbySql = editorInst.getNearbyStatement()
      allSql = editorInst.getAllStatements()
    })

    test('the content and length of statement is correct', () => {
      expect(allSql.length).toBe(2)
      expect(allSql[0].content).toBe(LINE_1)
      expect(allSql[1].content).toBe(LINE_2)
    })

    test('current sql is empty', () => {
      expect(curSql[0].content).toBe('')
    })

    test('nearby sql is line1', () => {
      expect(nearbySql?.content).toBe(LINE_1)
    })
  })

  describe('dispatch a selection action', () => {
    let curSql, nearbySql

    beforeAll(() => {
      editorInst.editorView.dispatch({
        selection: { anchor: 1, head: 2 }
      })
      curSql = editorInst.getCurStatements()
      nearbySql = editorInst.getNearbyStatement()
    })

    test('current sql is line1, nearby sql is line1', () => {
      expect(curSql[0].content).toBe(LINE_1)
      expect(nearbySql?.content).toBe(LINE_1)
    })
  })

  describe('dispatch a selection action', () => {
    let curSql, nearbySql

    beforeAll(() => {
      editorInst.editorView.dispatch({
        selection: { anchor: DOC.length, head: DOC.length }
      })
      curSql = editorInst.getCurStatements()
      nearbySql = editorInst.getNearbyStatement()
    })

    test('current sql is empty, nearby sql is line2', () => {
      expect(curSql[0].content).toBe('')
      expect(nearbySql?.content).toBe(LINE_2)
    })
  })

  describe('dispatch a selection action', () => {
    let curSql, nearbySql

    beforeAll(() => {
      editorInst.editorView.dispatch({
        selection: { anchor: 2, head: 2 + LINE_1.length + 5 }
      })
      curSql = editorInst.getCurStatements()
      nearbySql = editorInst.getNearbyStatement()
    })

    test('current sql length is 2, nearby sql is line1', () => {
      expect(curSql.length).toBe(2)
      expect(curSql[0].content).toBe(LINE_1)
      expect(curSql[1].content).toBe(LINE_2)
      expect(nearbySql?.content).toBe(LINE_1)
    })
  })
})
