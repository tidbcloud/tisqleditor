# @tidbcloud/tisqleditor-react

This package provides a react component wrap for `SQLEditorInstance` from `@tidbcloud/tisqleditor`.

## Try it

- [Full Featured Playground](https://tisqleditor.vercel.app/playgroud)
- [Simple Example](https://tisqleditor.vercel.app/examples)

## Installation

```shell
npm install @tidbcloud/tisqleditor-react
```

You need to install all its peer dependencies manually as well, such as `@codemirror/view`, `@codemirror/state`.

## React compatibility

The React wrapper supports **React 18.3.1 and React 19** (`^18.3.1 || ^19.0.0`).
Use matching React and React DOM versions, and the modern JSX transform
(TypeScript `jsx: "react-jsx"`, or Babel's automatic React runtime).

CI builds the wrapper and tests it with React/React DOM 18.3.1, 19.0.0 and 19.3.1,
using matching React type definitions. Tests cover ordinary and StrictMode mounts,
edits, cached document switching, theme/dialect updates and disposal. This matrix
covers the editor wrapper; it does not establish compatibility for the UIKit or
other packages used by an application's component tree. React 17 is not supported.

The regular development checkout stays on React 18.3.1. To reproduce another
matrix entry, use a disposable checkout and follow
[React Compatibility](../../.github/workflows/react-compatibility.yaml): install the
lockfile, select that entry's runtime and types in the workspace root and React
wrapper, then build and test. Version selection deliberately updates those local
manifests and the lockfile; do not commit the temporary matrix selection.

## Usage

`@tidbcloud/tisqleditor-react` supports multiple CodeMirror instances, it uses `EditorCacheProvider` as the context provider to cache the instances, then you can access all the cached editor instances anywhere inside the provider. You can put the provider in a proper place.

```tsx
import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

export default function () {
  return (
    <EditorCacheProvider>
      <App />
    </EditorCacheProvider>
  )
}
```

When `EditorCacheProvider` unmounts, it clears the cache and destroys every cached
CodeMirror view, releasing its listeners and plugins. Unmounting a `SQLEditor`
inside a mounted provider only detaches its view, so switching files preserves
edits. A standalone `SQLEditor` owns its cache and destroys its views on unmount.

`deleteEditor` and `clearEditors` dispose the removed views. Do not reuse a removed
instance or add it back to the cache; create a new instance instead. When closing
the active file, also update the active `editorId` or unmount that `SQLEditor`.

```tsx
import { SQLEditor } from '@tidbcloud/tisqleditor-react'

export function () {
  // ...

  return (
    <SQLEditor
      className="h-full"
      editorId={activeFile.id}
      doc={activeFile.content}
      sqlConfig={sqlConfig}
      theme={isDark ? oneDark : bbedit}
      extraExts={extraExts}
    />
  )
}
```

Inside the `SQLEditor`, it will check whether the editor instance already exists from the cached editor instances by `editorId`, if doesn't exist, it will create a new editor instance, and add to the cache automatically, else use the existed editor instance directly.

When you want to remove an editor instance from the cache, for example, close an opened SQL file, you need to do it manually.

```tsx
import { useEditorCacheContext } from '@tidbcloud/tisqleditor-react'

export function OpenedFilesTabs() {
  const {
    state: { openedFiles }
  } = useFilesContext()
  const cacheCtx = useEditorCacheContext()

  function handleCloseFile(file: IFile) {
    // ...

    // remove from cache
    cacheCtx.deleteEditor(file.id)
  }

  return (
    <div>
      {openedFiles.map((f) => (
        <div key={f.id}>
          <p>{f.name}</p>
          <button
            onClick={() => {
              handleCloseFile(f)
            }}
          >
            x
          </button>
        </div>
      ))}
    </div>
  )
}
```

> **Notice:** if you don't need to support multiple CodeMirror instances, aka you don't need to edit multiple SQL files at the same time, then you don't need to use the `<EditorCacheProvider>`, just to use `<SQLEditor>` component.

## API

### EditorCacheProvider

- `useEditorCacheContext()`: get the cache context
- `cacheCtx.addEditor(editorId, instance)`: add new editor instance
- `cacheCtx.getEditor(editorId)`: get the cached editor instance by editorId
- `cacheCtx.deleteEditor(editorId)`: remove and destroy the editor instance
- `cacheCtx.clearEditors()`: remove and destroy all cached editor instances

### SQLEditor Props

- `className`: CodeMirror root container css class
- `editorId`: editor id, used to differ multiple editor instances
- `doc`: editor initial content
- `sqlConfig`: config for SQL dialect, schemas, tables
- `theme`: editor theme, `@tidbcloud/codemirror-extensions-themes` provides 2 simple themes, `bbedit` for light mode, `oneDark` for dark mode, you can choose any other themes from third-party libraries or customize it by self
- `extraExts`: any other extra CodeMirror extensions you want to use, `@tidbcloud/tisqleditor-react` install some builtin extensions, likes `@codemirror/lang-sql`, `@tidbcloud/codemirror-extension-sql-parser`, `@tidbcloud/codemirror-extension-cur-sql`
