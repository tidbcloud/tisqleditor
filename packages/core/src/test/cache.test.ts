import { createSQLEditorInstance, EditorCache } from '..'

test('editor instance cache works fine', () => {
  const cache = new EditorCache()
  const editorInst = createSQLEditorInstance({
    editorId: '111',
    doc: 'select * from test;'
  })

  expect(cache.getEditor('111')).toBe(undefined)

  cache.addEditor('111', editorInst)
  expect(cache.getEditor('111')).toBe(editorInst)

  cache.deleteEditor('222')
  expect(cache.getEditor('111')).toBe(editorInst)

  cache.deleteEditor('111')
  expect(cache.getEditor('111')).toBe(undefined)

  cache.addEditor('111', editorInst)
  expect(cache.getEditor('111')).toBe(editorInst)

  cache.clearEditors()
  expect(cache.getEditor('111')).toBe(undefined)
})
