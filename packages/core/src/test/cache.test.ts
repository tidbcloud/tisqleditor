import { createSQLEditorInstance, EditorCache } from '..'

describe('editor instance cache works fine', () => {
  const cache = new EditorCache()
  const editorInst = createSQLEditorInstance({
    editorId: '111',
    doc: 'select * from test;'
  })

  test('no cache added', () => {
    expect(cache.getEditor('111')).toBe(undefined)
  })

  test('add one instance 111 to cache', () => {
    cache.addEditor('111', editorInst)
    expect(cache.getEditor('111')).toBe(editorInst)
  })

  test('remove instance 222 from cache', () => {
    cache.deleteEditor('222')
    expect(cache.getEditor('111')).toBe(editorInst)
  })

  test('remove instance 111 from cache', () => {
    cache.deleteEditor('111')
    expect(cache.getEditor('111')).toBe(undefined)
  })

  test('clear cache', () => {
    cache.addEditor('111', editorInst)
    expect(cache.getEditor('111')).toBe(editorInst)

    cache.clearEditors()
    expect(cache.getEditor('111')).toBe(undefined)
  })
})
