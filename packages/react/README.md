# @tidbcloud/tisqleditor-react

This package provides a react component wrap for `@tidbcloud/tisqleditor`.

## Installation

```shell
npm install @tidbcloud/tisqleditor-react
```

You need to install the its peer dependencies manually as well, likes `@codemirror/view`, `@codemirror/state`.

## Usage

`@tidbcloud/tisqleditor-react` supports multiple CodeMirror instances, it uses `EditorCacheProvider` as the context provider to cache the instances, then you can access all the cached editor instances anywhere inside the provider. You can put the provider in a proper place.

```jsx
import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

export default function () {
  return (
    <EditorCacheProvider>
      <App />
    </EditorCacheProvider>
  )
}
```

When `EditorCacheProvider` unmounts, it will clear all the cached editor instances.

```jsx
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

## API

### EditorCacheProvider

- `useEditorCacheContext()`: get the cache context
- `cacheCtx.addEditor(editorId, instance)`: add new editor instance
- `cacheCtx.getEditor(editorId)`: get the cached editor instance by editorId
- `cacheCtx.deleteEditor(editorId)`: remove the editor instance from cache
- `cacheCtx.clearEditors()`: clear all cached editor instances

### SQLEditor Props

- `className`: CodeMirror root container css class
- `editorId`: editor id, used to differ multiple editor instances
- `doc`: editor initial content
- `sqlConfig`: config for SQL dialect, schemas, tables
- `theme`: editor theme, `@tidbcloud/tisqleditor-extensions-themes` provides 2 simple themes, `bbedit` for light mode, `oneDark` for dark mode, you can choose any other themes from third-party libraries or customize it by self
- `extraExts`: any other extra CodeMirror extensions you want to use, `@tidbcloud/tisqleditor-react` install some builtin extensions, likes `@tidbcloud/tisqleditor-extension-sql-parser`, `@tidbcloud/tisqleditor-extension-cur-sql`
