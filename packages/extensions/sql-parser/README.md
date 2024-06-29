# @tidbcloud/codemirror-extension-sql-parser

A codemirror extension listens the editor doc change, parses the content to SQL statements.

This extension is installed internally inside the `SQLEditorInstance`.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-sql-parser
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/language @codemirror/lang-sql
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [sql({ dialect: MySQL }), sqlParser()]
  })
})
```

## API

```ts
type SqlStatement = {
  from: number
  to: number
  lineFrom: number
  lineTo: number
  content: string
  database: string
  type: 'use' | 'ddl' | 'other'
}

/* get all parsed statements */
function getSqlStatements(state: EditorState): SqlStatement[]

/* get the nearest statement before the pos */
function getNearbyStatement(
  state: EditorState,
  pos: number
): SqlStatement | undefined

function sqlParser(): Extension
```
