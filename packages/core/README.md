# @tidbcloud/tisqleditor

This package provides the `SQLEditorInstance` and `EditorCache` implementation.

`SQLEditorInstance` creates EditorView instance with pre-configured extensions to make it available to edit SQL code.

`EditorCache` stores the `SQLEditorInstance` in a map.

## Installation

```shell
npm install @tidbcloud/tisqleditor
```

You need to install its peer dependencies as well.

```shell
npm install @codemirror/view @codemirror/state @codemirror/lang-sql @codemirror/language @codemirror/search
```

## Usage

```ts
import { EditorCache, createSQLEditorInstance } from '@tidbcloud/tisqleditor'

const cache = new EditorCache()
const editorId = '1'
const editorInst = createSQLEditorInstance({
  editorId,
  doc: 'select * from test;'
})

cache.addEditor(editorId, editorInst)
```

## API

### createSQLEditorInstance

```ts
type CreateSQLEditorOptions = {
  editorId: string
  doc: string

  basicSetupOptions?: BasicSetupOptions
  sqlConfig?: SQLConfig
  theme?: Extension
  extraExts?: Extension
  extraData?: {}
}

const createSQLEditorInstance: (
  options: CreateSQLEditorOptions
) => SQLEditorInstance
```

### SQLEditorInstance

```ts
class SQLEditorInstance {
  editorId: string
  editorView: EditorView
  themeCompartment: Compartment
  sqlCompartment: Compartment
  extraData: {}

  constructor(
    editorId: string,
    editorView: EditorView,
    themeCompartment: Compartment,
    sqlCompartment: Compartment,
    extraData: {}
  )

  changeTheme(theme: Extension): void
  changeSQLConfig(sqlConfig: SQLConfig): void

  /* get all statements */
  getAllStatements(): SqlStatement[]
  /* get selected statements */
  getCurStatements(): SqlStatement[]
  /* get the nearest statement before the cursor */
  getNearbyStatement(): SqlStatement | undefined
}
```

### EditorCache

```ts
class EditorCache {
  addEditor: (editorId: string, editor: SQLEditorInstance) => void
  getEditor: (editorId: string) => SQLEditorInstance | undefined
  deleteEditor: (editorId: string) => void
  clearEditors: () => void
}
```
