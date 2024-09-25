# @tidbcloud/codemirror-extension-cur-sql-gutter

A codemirror extension listens the editor selection change, and shows gutter for the SQL statements around the cursor position to make it highlight.

## Try it

- [Full Featured Playground](https://tisqleditor.vercel.app/playgroud)
- [Simple Example](https://tisqleditor.vercel.app/examples?ex=cur-sql-gutter)

## Installation

```shell
npm install @tidbcloud/codemirror-extension-cur-sql-gutter
```

You need to install its dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/lang-sql @tidbcloud/codemirror-extension-sql-parser @tidbcloud/codemirror-extension-cur-sql
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'
import { curSql } from '@tidbcloud/codemirror-extension-cur-sql'
import { curSqlGutter } from '@tidbcloud/codemirror-extension-cur-sql-gutter'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [sql({ dialect: MySQL }), sqlParser(), curSql(), curSqlGutter()]
  })
})
```

## API

```ts
interface CurSqlGutterConfig {
  /* gutter background */
  backgroundColor?: string
  /* gutter width */
  width?: number
  /* gutter extra css class */
  className?: string
  /* control gutter to hide when some cases happen */
  whenHide?: (view: EditorView) => boolean
}

function curSqlGutter(config?: CurSqlGutterConfig): Extension
```
