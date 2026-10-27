import { StrictMode, version as reactVersion } from 'react'
import { version as reactDOMVersion } from 'react-dom'
import { act, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { EditorView, ViewPlugin } from '@codemirror/view'
import { MySQL, PostgreSQL } from '@codemirror/lang-sql'
import { language } from '@codemirror/language'
import { EditorCache } from '@tidbcloud/tisqleditor'
import { EditorCacheProvider, SQLEditor, useEditorCacheContext } from '..'

let cache: EditorCache
function CacheProbe() {
  cache = useEditorCacheContext()
  return null
}

const destroyed = jest.fn()
const lifecycle = ViewPlugin.define(() => ({ destroy: destroyed }))

beforeEach(() => destroyed.mockClear())

test('the compatibility job uses the requested React and React DOM versions', () => {
  expect(reactDOMVersion).toBe(reactVersion)
  if (process.env.EXPECTED_REACT_VERSION) {
    expect(reactVersion).toBe(process.env.EXPECTED_REACT_VERSION)
  }
})

for (const strict of [false, true]) {
  test(`provider cache stays live and disposes editors (StrictMode=${strict})`, () => {
    const content = (
      <EditorCacheProvider>
        <CacheProbe />
        <SQLEditor editorId="first" doc="SELECT 1;" extraExts={[lifecycle]} />
      </EditorCacheProvider>
    )
    const result = render(strict ? <StrictMode>{content}</StrictMode> : content)
    const view = cache.getEditor('first')!.editorView
    expect(result.container.querySelectorAll('.cm-editor')).toHaveLength(1)
    expect(view.dom).toBeInTheDocument()
    act(() =>
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: 'SELECT 2;' }
      })
    )
    expect(view.state.doc.toString()).toBe('SELECT 2;')
    const beforeUnmount = destroyed.mock.calls.length
    result.unmount()
    expect(cache.getEditor('first')).toBeUndefined()
    expect(destroyed).toHaveBeenCalledTimes(beforeUnmount + 1)
  })

  test(`standalone editor disposes its view (StrictMode=${strict})`, () => {
    const editor = (
      <SQLEditor
        editorId="standalone"
        doc="SELECT 1;"
        extraExts={[lifecycle]}
      />
    )
    const result = render(strict ? <StrictMode>{editor}</StrictMode> : editor)
    expect(result.container.querySelectorAll('.cm-editor')).toHaveLength(1)
    const beforeUnmount = destroyed.mock.calls.length
    result.unmount()
    expect(destroyed).toHaveBeenCalledTimes(beforeUnmount + 1)
  })
}

test('switching documents preserves the cached edit, theme and dialect remain configurable', () => {
  function App({ id = 'first', dark = false }) {
    return (
      <EditorCacheProvider>
        <CacheProbe />
        <SQLEditor
          editorId={id}
          doc="SELECT 1;"
          theme={EditorView.theme({}, { dark })}
          sqlConfig={{ dialect: dark ? PostgreSQL : MySQL }}
        />
      </EditorCacheProvider>
    )
  }
  const result = render(<App />)
  const first = cache.getEditor('first')!.editorView
  expect(first.state.facet(language)).toBe(MySQL.language)
  act(() =>
    first.dispatch({
      changes: { from: 0, to: first.state.doc.length, insert: 'SELECT 42;' }
    })
  )
  result.rerender(<App id="second" />)
  expect(first.dom).not.toBeInTheDocument()
  result.rerender(<App dark />)
  expect(cache.getEditor('first')!.editorView).toBe(first)
  expect(first.state.doc.toString()).toBe('SELECT 42;')
  expect(first.state.facet(EditorView.darkTheme)).toBe(true)
  expect(first.state.facet(language)).toBe(PostgreSQL.language)
  expect(result.container.querySelectorAll('.cm-editor')).toHaveLength(1)
  expect(screen.getByText('42')).toBeInTheDocument()
})

test('detaching an editor keeps its document until the owning provider unmounts', () => {
  function App({ visible = true }) {
    return (
      <EditorCacheProvider>
        <CacheProbe />
        {visible && (
          <SQLEditor editorId="first" doc="SELECT 1;" extraExts={[lifecycle]} />
        )}
      </EditorCacheProvider>
    )
  }
  const result = render(<App />)
  const first = cache.getEditor('first')!.editorView
  act(() => first.dispatch({ changes: { from: 0, insert: '-- saved\n' } }))
  result.rerender(<App visible={false} />)
  expect(first.dom).not.toBeInTheDocument()
  expect(destroyed).not.toHaveBeenCalled()
  result.rerender(<App />)
  expect(cache.getEditor('first')!.editorView).toBe(first)
  expect(first.state.doc.toString()).toBe('-- saved\nSELECT 1;')
  result.unmount()
  expect(destroyed).toHaveBeenCalledTimes(1)
})

test('closing a cached editor before its component unmounts is safe', () => {
  const result = render(
    <EditorCacheProvider>
      <CacheProbe />
      <SQLEditor editorId="first" doc="SELECT 1;" extraExts={[lifecycle]} />
    </EditorCacheProvider>
  )
  act(() => cache.deleteEditor('first'))
  expect(destroyed).toHaveBeenCalledTimes(1)
  expect(result.container.querySelector('.cm-editor')).toBeNull()
  result.unmount()
  expect(destroyed).toHaveBeenCalledTimes(1)
})
