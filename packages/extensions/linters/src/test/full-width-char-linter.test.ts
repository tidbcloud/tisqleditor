import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { MySQL, sql } from '@codemirror/lang-sql'
import { diagnosticCount, forEachDiagnostic } from '@codemirror/lint'

import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'

import { fullWidthCharLinter } from '..'

const LINE_1 = 'SELECT * from test LIMIT 1；\n'
const LINE_2 = 'USE game;\n'

describe('test full width char linter', () => {
  let container: HTMLDivElement,
    editorView: EditorView = new EditorView()

  beforeAll(() => {
    jest.useFakeTimers()

    container = document.createElement('div')
    container.style.height = '100px'

    editorView = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: [
          sql({ dialect: MySQL }),
          sqlParser(),
          fullWidthCharLinter()
        ]
      }),
      parent: container
    })
  })

  afterAll(() => jest.useRealTimers())

  test('add LINE_1', async () => {
    editorView.dispatch({ changes: { from: 0, insert: LINE_1 } })
    await jest.advanceTimersByTime(1000)
    expect(diagnosticCount(editorView.state)).toBe(0)
  })

  test('add LINE_2 after LINE_1', async () => {
    // dispatch changes transaction to make `diagnosticCount(editorView.state)` update
    editorView.dispatch({ changes: { from: LINE_1.length, insert: LINE_2 } })
    await jest.advanceTimersByTime(1000)
    expect(diagnosticCount(editorView.state)).toBe(1)
    forEachDiagnostic(editorView.state, (d, from, to) => {
      expect(d.severity).toBe('error')
      expect(from).toBe(26)
      expect(to).toBe(27)
    })
  })
})
