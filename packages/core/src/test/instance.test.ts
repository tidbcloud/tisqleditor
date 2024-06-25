import { createSQLEditorInstance } from '../editor-instance'

function sum(a: number, b: number) {
  return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

test('create instance successfully', () => {
  const instance = createSQLEditorInstance({
    editorId: '111',
    doc: '222'
  })
  expect(instance.editorId).toBe('111')
})
