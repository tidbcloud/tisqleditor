# @tidbcloud/codemirror-extension-sql-autocomplete

This extension implements the SQL keyword and database schema autocompletion based `@codemirror/autocomplete` for the CodeMirror6 editor, with a customized style.

## Try it

- [Full Featured Playground](https://tisqleditor-playground.netlify.app/)
- [Simple Example](https://tisqleditor-playground.netlify.app/?example=sql-autocomplete&with_select)

## Installation

```shell
npm install @tidbcloud/codemirror-extension-sql-autocomplete
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/autocomplete @codemirror/commands @codemirror/lang-sql
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlAutoCompletion } from '@tidbcloud/codemirror-extension-sql-autocomplete'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      sql({ dialect: MySQL }),

      sqlAutoCompletion({
        acceptKey: 'Tab',
        autocompleteItemClassName: 'autocomplete-item-test'
        // ...
      })
    ]
  })
})
```

## API

```ts
/* DefaultCompletionConfig configs please refer to: https://codemirror.net/docs/ref/#autocomplete.autocompletion */
interface AutoCompletionConfig extends DefaultCompletionConfig {
  /**
  accept the completion by pressing the key, defult is Tab
  */
  acceptKey?: string
  /**
  the classname added to the auto completion item
  */
  autocompleteItemClassName?: string
  /**
  The maximum number of options to render to the DOM, default is 50
  */
  maxRenderedOptions?: number
  /**
  The icon map for the auto completion item, the key is the type of the completion, the value is the img src
  */
  renderIconMap?: Record<string, string>
}

function sqlAutoCompletion(config?: AutoCompletionConfig): Extension
```
