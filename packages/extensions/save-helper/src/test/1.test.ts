import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { saveHelper } from '..'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT * from companies LIMIT 10;`

const INIT_DOC = `\n${LINE_1}\n\n`

jest.useFakeTimers()

test('test auto save after content changes without any delay', async () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          save(view) {
            latestContent = view.state.doc.toString()
          },
          delay: 0
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  expect(latestContent).toBe(``)

  await jest.advanceTimersByTime(0)
  expect(latestContent).toBe(`${LINE_2}${INIT_DOC}`)
})

test('test auto save after content changes without 1s delay', async () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          save(view) {
            latestContent = view.state.doc.toString()
          },
          delay: 1000
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  expect(latestContent).toBe(``)

  await jest.advanceTimersByTime(100)
  expect(latestContent).toBe(``)

  await jest.advanceTimersByTime(1000)
  expect(latestContent).toBe(`${LINE_2}${INIT_DOC}`)
})

test('test turn off auto save', async () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          auto: false,
          save(view) {
            latestContent = view.state.doc.toString()
          },
          delay: 0
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  await jest.advanceTimersByTime(100)
  expect(latestContent).toBe(``)
})

test('test manual save with default hotkey', () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          auto: false,
          save(view) {
            latestContent = view.state.doc.toString()
          }
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  // TODO
  // press Mod-s

  expect(latestContent).toBe(``)
})

test('test manual save with a non-default hotkey', () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          auto: false,
          hotkey: 'Mod-i',
          save(view) {
            latestContent = view.state.doc.toString()
          }
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  // TODO
  // press Mod-i

  expect(latestContent).toBe(``)
})

test('test turn off manual save', () => {
  let latestContent = ''
  const editorView = new EditorView({
    state: EditorState.create({
      doc: INIT_DOC,
      extensions: [
        saveHelper({
          auto: false,
          hotkey: '',
          save(view) {
            latestContent = view.state.doc.toString()
          }
        })
      ]
    })
  })

  // dispatch a change transaction to update the content
  editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })

  // TODO
  // press Mod-i

  expect(latestContent).toBe(``)
})
