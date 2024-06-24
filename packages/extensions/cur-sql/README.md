# @tidbcloud/tisqleditor-extension-cur-sql

This extension listens the editor selection change, return the selected statements.

This extension is installed internally inside the `SQLEditorInstance`.

## Installation

```shell
npm install @tidbcloud/tisqleditor-extension-cur-sql
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state
```

## Usage

```js
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { curSql } from '@tidbcloud/tisqleditor-extension-cur-sql'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [curSql()]
  })
})
```

## API

```js
function curSql(): Extension;

/* get selected statements */
function getCurStatements(state: EditorState): SqlStatement[];
```
