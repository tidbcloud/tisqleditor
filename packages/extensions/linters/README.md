# @tidbcloud/codemirror-extension-linters

This extension provides 3 linters:

- fullWidthCharLinter: lint all the chinese characters
- useDbLinter: use statement linter, the first statement should be use dbName;
- regexMatchLinter: configurable by regular expression

## Installation

```shell
npm install @tidbcloud/codemirror-extension-linters
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/lint
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { fullWidthCharLinter } from '@tidbcloud/codemirror-extension-linters'

interface charLinterConfig {
  title?: string
  message?: string
}

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      fullWidthCharLinter({
        title: 'the title when error',
        message: 'error content'
      })
    ]
  })
})
```

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { useDbLinter } from '@tidbcloud/codemirror-extension-linters'

type DBLinterOptions = {
  level?: 'error' | 'warning'
  title?: string
  message?: string
  whenDisable?: (view: EditorView) => boolean // the linter will be hidden when return false
}

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      useDbLinter({
        level: 'warning',
        title: 'the title when error',
        message: 'error content'
      })
    ]
  })
})
```

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { regexMatchLinter } from '@tidbcloud/codemirror-extension-linters'

interface RegexpItem {
  reg: RegExp
  title: string
  message: string
}

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
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
function fullWidthCharLinter(config?: charLinterConfig): Extension
function useDbLinter(config?: DBLinterOptions): Extension
function regexMatchLinter(config?: RegexpItem[]): Extension
```
