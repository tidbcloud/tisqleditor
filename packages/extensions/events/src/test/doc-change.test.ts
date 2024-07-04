import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { onDocChange } from '..'

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

describe('test change event', () => {
  describe('a empty doc, insert LINE_1', () => {
    let doc = '',
      editorView: EditorView = new EditorView()

    beforeAll(() => {
      editorView = new EditorView({
        state: EditorState.create({
          doc: '',
          extensions: [
            onDocChange((_view, content) => {
              doc = content
            })
          ]
        })
      })

      editorView.dispatch({ changes: { from: 0, insert: LINE_1 } })
    })

    test('doc should to be LINE_1', () => expect(doc).toBe(LINE_1))
  })

  describe('a doc has LINE_1 and insert LINE_2 after LINE_1', () => {
    let doc = '',
      editorView: EditorView = new EditorView()

    beforeAll(() => {
      editorView = new EditorView({
        state: EditorState.create({
          doc: LINE_1,
          extensions: [
            onDocChange((_view, content) => {
              doc = content
            })
          ]
        })
      })

      editorView.dispatch({
        changes: { from: LINE_1.length, insert: `\n${LINE_2}` }
      })
    })

    test('doc should to be DOC', () => expect(doc).toBe(DOC))
  })
})
