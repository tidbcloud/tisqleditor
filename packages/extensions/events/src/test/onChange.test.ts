import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { onChange } from '..'

const LINE_1 = 'USE game;'
const LINE_2 = `SELECT
*
from
game.all_audio_language
LIMIT
10;`

const DOC = `${LINE_1}\n${LINE_2}`

test('test change event', () => {
  let curSql = ''

  const editorView = new EditorView({
    state: EditorState.create({
      doc: '',
      extensions: [
        onChange((sql) => {
          curSql = sql
        })
      ]
    })
  })

  editorView.dispatch({ changes: { from: 0, insert: LINE_1 } })
  expect(curSql).toBe(LINE_1)

  editorView.dispatch({
    changes: { from: LINE_1.length, insert: `\n${LINE_2}` }
  })
  expect(curSql).toBe(DOC)
})
