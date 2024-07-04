import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { onSelectionChange, SelectionRange } from '..'

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

describe('test selection change event', () => {
  let selRanges: SelectionRange[] = []
  let editorView: EditorView = new EditorView()

  beforeAll(() => {
    jest.useFakeTimers()

    editorView = new EditorView({
      state: EditorState.create({
        doc: '',
        extensions: [
          onSelectionChange((_view, ranges) => {
            selRanges = ranges
          })
        ]
      })
    })

    editorView.dispatch({ changes: { from: 0, insert: DOC } })
  })

  afterAll(() => jest.useRealTimers())

  test('select 0 to LINE_1.length, the selectionRange is correct', async () => {
    editorView.dispatch({ selection: { anchor: 0, head: LINE_1.length } })
    await jest.advanceTimersByTime(100)

    expect(selRanges[0].from).toBe(0)
    expect(selRanges[0].to).toBe(LINE_1.length)
  })

  test('select LINE_1.length to DOC.length, the selectionRange is correct', async () => {
    editorView.dispatch({
      selection: { anchor: LINE_1.length, head: DOC.length }
    })
    await jest.advanceTimersByTime(100)

    expect(selRanges[0].from).toBe(LINE_1.length)
    expect(selRanges[0].to).toBe(DOC.length)
  })
})
