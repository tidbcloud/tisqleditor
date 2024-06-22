# @tidbcloud/tisqleditor-react

This package provides a react component for tisqleditor.

## Quick Start

### Installation

```shell
npm install @tidbcloud/tisqleditor-react
```

### Usage

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

```jsx
import { SQLEditor } from '@tidbcloud/tisqleditor-react'

export function() {
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
