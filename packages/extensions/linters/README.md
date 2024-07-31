# @tidbcloud/codemirror-extension-linters

3 linter codemirror extensions:

- useDbLinter: use statement linter, the first statement should be `use ${dbName};`
- fullWidthCharLinter: lint all the full width characters
- regexMatchLinter: configurable by regular expression

## Try it

- [Full Featured Playground](https://tisqleditor.vercel.app/playgroud)
- [Simple Example](https://tisqleditor.vercel.app/examples?ex=use-db-linter)

## Installation

```shell
npm install @tidbcloud/codemirror-extension-linters
```

You need to install its dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/lint @codemirror/lang-sql @tidbcloud/codemirror-extension-sql-parser
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
          reg: /\$\{page\}/g,
          level: 'warning',
          title: 'Code Error',
          message: pageTips
        },
        {
          reg: /\$\{page_size\}/g,
          level: 'error',
          title: 'Code Error',
          message:
            '<b>page</b> and <b>page_size</b> are built-in paging variables in the system, please replace the name of parameters.'
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
