import { ViewPlugin } from '@codemirror/view'
import { createSQLEditorInstance, EditorCache } from '..'

test('deleting an editor releases its plugins exactly once and preserves other editors', () => {
  const cache = new EditorCache()
  const destroyed = jest.fn()
  const createEditor = (editorId: string) =>
    createSQLEditorInstance({
      editorId,
      doc: 'SELECT 1;',
      extraExts: [ViewPlugin.define(() => ({ destroy: destroyed }))]
    })
  const first = createEditor('first')
  const second = createEditor('second')
  cache.addEditor('first', first)
  cache.addEditor('second', second)
  cache.deleteEditor('missing')
  expect(destroyed).not.toHaveBeenCalled()
  cache.deleteEditor('first')
  cache.deleteEditor('first')
  expect(cache.getEditor('first')).toBeUndefined()
  expect(cache.getEditor('second')).toBe(second)
  expect(destroyed).toHaveBeenCalledTimes(1)
  cache.clearEditors()
  cache.clearEditors()
  expect(cache.getEditor('second')).toBeUndefined()
  expect(destroyed).toHaveBeenCalledTimes(2)
})

test('clearing a cache destroys every remaining view and allows new instances', () => {
  const cache = new EditorCache()
  const destroyed = jest.fn()
  for (const editorId of ['first', 'second']) {
    cache.addEditor(
      editorId,
      createSQLEditorInstance({
        editorId,
        doc: '',
        extraExts: [ViewPlugin.define(() => ({ destroy: destroyed }))]
      })
    )
  }
  cache.clearEditors()
  expect(destroyed).toHaveBeenCalledTimes(2)
  expect(cache.getEditor('first')).toBeUndefined()
  expect(cache.getEditor('second')).toBeUndefined()
  const replacement = createSQLEditorInstance({
    editorId: 'first',
    doc: 'SELECT 2;'
  })
  cache.addEditor('first', replacement)
  replacement.editorView.dispatch({ changes: { from: 0, insert: '-- new\n' } })
  expect(cache.getEditor('first')!.editorView.state.doc.toString()).toBe(
    '-- new\nSELECT 2;'
  )
  cache.clearEditors()
})
