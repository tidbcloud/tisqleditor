import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'

import { saveHelper } from '..'

const LINE_1 = `USE sp500insight;`
const LINE_2 = `SELECT * from companies LIMIT 10;`

const INIT_DOC = `\n${LINE_1}\n\n`

describe.each([
  { delay: 0, auto: true, expected: `${LINE_2}${INIT_DOC}` },
  { delay: 1000, auto: true, expected: `${LINE_2}${INIT_DOC}` },
  { delay: 0, auto: false, expected: '' }
])('test auto save', ({ delay, auto, expected }) => {
  let latestContent = '',
    editorView

  beforeAll(() => {
    jest.useFakeTimers()
    editorView = new EditorView({
      state: EditorState.create({
        doc: INIT_DOC,
        extensions: [
          saveHelper({
            auto,
            save(view) {
              latestContent = view.state.doc.toString()
            },
            delay
          })
        ]
      })
    })

    editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  test('content should be empty', () => {
    expect(latestContent).toBe('')
  })

  if (delay > 0) {
    test('wait for half specfic millseconds, content should be empty', async () => {
      await jest.advanceTimersByTime(delay / 2)
      expect(latestContent).toBe('')
    })
  }

  test('wait for specfic millseconds, content should be equal to expected value', async () => {
    await jest.advanceTimersByTime(delay)
    expect(latestContent).toBe(expected)
  })
})

describe.each([{ hotkey: undefined }, { hotkey: 'Mod-i' }, { hotkey: '' }])(
  'test manual save',
  ({ hotkey }) => {
    let latestContent = '',
      editorView

    beforeAll(() => {
      editorView = new EditorView({
        state: EditorState.create({
          doc: INIT_DOC,
          extensions: [
            saveHelper({
              auto: false,
              hotkey,
              save(view) {
                latestContent = view.state.doc.toString()
              }
            })
          ]
        })
      })

      editorView.dispatch({ changes: { from: 0, insert: LINE_2 } })
    })

    test('content should be empty', () => {
      expect(latestContent).toBe(``)
    })
  }
)
