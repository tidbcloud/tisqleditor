# @tidbcloud/codemirror-extension-linters

3 linter codemirror extensions:

- useDbLinter: use statement linter, the first statement should be `use ${dbName};`
- fullWidthCharLinter: lint all the full width characters
- regexMatchLinter: configurable by regular expression

## Try it

- [Full Featured Playground](https://tisqleditor-playground.netlify.app/)
- [Simple Example](https://tisqleditor-playground.netlify.app/?example=use-db-linter&with_select)

## Installation

```shell
npm install @tidbcloud/codemirror-extension-linters
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/lint @codemirror/lang-sql
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'
import {
  useDbLinter,
  fullWidthCharLinter,
  regexMatchLinter
} from '@tidbcloud/codemirror-extension-linters'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      sql({ dialect: MySQL }),
      sqlParser(),

      useDbLinter({
        level: 'warning',
        title: 'the title when error',
        message: 'error content'
      }),
      fullWidthCharLinter({
        title: 'the title when error',
        message: 'error content'
      }),
      regexMatchLinter([
        {
          reg: /[a-z]/,
          title: 'test reg error',
          message: 'test reg error content'
        }
      ])
    ]
  })
})
```

## API

```ts
type DBLinterOptions = {
  level?: 'error' | 'warning'
  title?: string
  message?: string
  /* control to disable the lint when some cases happen in run time */
  whenDisable?: (view: EditorView) => boolean
}
function useDbLinter(config?: DBLinterOptions): Extension

interface CharLinterConfig {
  title?: string
  message?: string
}
function fullWidthCharLinter(config?: charLinterConfig): Extension

interface RegexpItem {
  reg: RegExp
  title: string
  message: string
}
function regexMatchLinter(config: RegexpItem[]): Extension
```
