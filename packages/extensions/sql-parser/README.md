# @tidbcloud/codemirror-extension-sql-parser

This extension listens the editor doc change, return all the parsed statements.

This extension is installed internally inside the `SQLEditorInstance`.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-sql-parser
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/language
```

## Usage

```js
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [sqlParser()]
  })
})
```

## API

```js
type SqlStatement = {
    from: number;
    to: number;
    lineFrom: number;
    lineTo: number;
    content: string;
    database: string;
    type: 'use' | 'ddl' | 'other';
};

// get all parsed statements
function getSqlStatements(state: EditorState): SqlStatement[];
// get the nearest statement before the pos
function getNearbyStatement(state: EditorState, pos: number): SqlStatement | undefined;

function sqlParser(): Extension;
```