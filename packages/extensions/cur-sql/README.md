# @tidbcloud/codemirror-extension-cur-sql

A codemirror extension listens the editor selection change, returns the complete SQL statements around the cursor position.

This extension is installed internally inside the `SQLEditorInstance`.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-cur-sql
```

You need to install its dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/language @codemirror/lang-sql @tidbcloud/codemirror-extension-sql-parser
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'
import { curSql } from '@tidbcloud/codemirror-extension-cur-sql'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [sql({ dialect: MySQL }), sqlParser(), curSql()]
  })
})
```

## API

```ts
/* get selected statements */
function getCurStatements(state: EditorState): SqlStatement[]

function curSql(): Extension
```
