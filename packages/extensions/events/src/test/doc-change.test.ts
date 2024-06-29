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

test('test change event', () => {
  let doc = ''

  const editorView = new EditorView({
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
  expect(doc).toBe(LINE_1)

  editorView.dispatch({
    changes: { from: LINE_1.length, insert: `\n${LINE_2}` }
  })
  expect(doc).toBe(DOC)
})
