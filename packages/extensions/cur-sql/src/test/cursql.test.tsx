import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import React, { useEffect, useRef } from 'react'

import { createSQLEditorInstance, EditorCache } from '../../../../core'

const cache = new EditorCache()
const Codemirror = () => {
  const editorContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const editor = createSQLEditorInstance({
      editorId: 'curSqlTestCodemirror',
      doc: ``
    })
    cache.addEditor(editor.editorId, editor)
    editorContainerRef.current?.appendChild(editor.editorView.dom)
  }, [])

  return <div className="cur-sql-test" ref={editorContainerRef} />
}

test('cur sql extension', () => {
  render(<Codemirror />)

  const editor = cache.getEditor('curSqlTestCodemirror')
  expect(editor).not.toBeUndefined()
  if (!editor) return

  editor.editorView.focus()

  const line1 = 'USE game;'
  const line2 = `SELECT
  *
from
  game.all_audio_language
LIMIT
  10;`

  const doc = `${line1}\n${line2}`

  editor.editorView.dispatch({ changes: { from: 0, to: 0, insert: doc } })

  let curSql = editor.getCurStatements()
  expect(curSql[0].content).toBe(line1)

  editor.editorView.dispatch({
    selection: { anchor: doc.length, head: doc.length }
  })
  curSql = editor.getCurStatements()
  expect(curSql[0].content).toBe(line2)

  const allSql = editor.getAllStatements()
  expect(allSql.length).toBe(2)
  expect(allSql[0].content).toBe(line1)
  expect(allSql[1].content).toBe(line2)
})
