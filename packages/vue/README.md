# @tidbcloud/tisqleditor-vue

This package provides a vue component wrap for `SQLEditorInstance` from `@tidbcloud/tisqleditor`.

## Installation

```shell
npm install @tidbcloud/tisqleditor-vue
```

You need to install all its peer dependencies manually as well, such as `@codemirror/view`, `@codemirror/state`.

## Usage

`@tidbcloud/tisqleditor-vue` supports multiple CodeMirror instances, it uses `EditorCacheProvide` to cache the instances, then you can access all the cached editor instances anywhere inside the provide. You can put the provide in a proper place.

```vue
<script setup>
import { EditorCacheProvide, SQLEditor } from '@tidbcloud/tisqleditor-vue'
</script>

<template>
  <EditorCacheProvide>
    <SQLEditor editorId="test" doc="select * from test;" />
  </EditorCacheProvide>
</template>
```

When `EditorCacheProvide` unmounts, it will clear all the cached editor instances.

## API

### EditorCacheProvide

- `const cache=inject('editor-cache')`: get the cache
- `cache.addEditor(editorId, instance)`: add new editor instance
- `cache.getEditor(editorId)`: get the cached editor instance by editorId
- `cache.deleteEditor(editorId)`: remove the editor instance from cache
- `cache.clearEditors()`: clear all cached editor instances

### SQLEditor Props

- `class`: CodeMirror root container css class
- `editorId`: editor id, used to differ multiple editor instances
- `doc`: editor initial content
- `sqlConfig`: config for SQL dialect, schemas, tables
- `theme`: editor theme, `@tidbcloud/codemirror-extensions-themes` provides 2 simple themes, `bbedit` for light mode, `oneDark` for dark mode, you can choose any other themes from third-party libraries or customize it by self
- `extraExts`: any other extra CodeMirror extensions you want to use, `@tidbcloud/tisqleditor-react` install some builtin extensions, likes `@codemirror/lang-sql`, `@tidbcloud/codemirror-extension-sql-parser`, `@tidbcloud/codemirror-extension-cur-sql`
