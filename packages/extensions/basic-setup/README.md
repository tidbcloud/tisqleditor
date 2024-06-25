# @tidbcloud/codemirror-extension-basic-setup

Basic configuration for the CodeMirror6 code editor.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-basic-setup
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/autocomplete @codemirror/commands @codemirror/lang-sql @codemirror/language  @codemirror/lint @codemirror/search @codemirror/state @codemirror/view  @lezer/highlight
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
  BasicSetupOptions,
  basicSetup
} from '@tidbcloud/codemirror-extension-basic-setup'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      basicSetup({
        foldGutter: false,
        foldKeymap: false,
        searchKeymap: true,
        autocompletion: false
      })
    ]
  })
})
```

## API

```ts
export interface MinimalSetupOptions {
  highlightSpecialChars?: boolean
  history?: boolean
  drawSelection?: boolean
  syntaxHighlighting?: boolean

  defaultKeymap?: boolean
  historyKeymap?: boolean
}

export interface BasicSetupOptions extends MinimalSetupOptions {
  lineNumbers?: boolean
  highlightActiveLineGutter?: boolean
  foldGutter?: boolean
  dropCursor?: boolean
  allowMultipleSelections?: boolean
  indentOnInput?: boolean
  bracketMatching?: boolean
  closeBrackets?: boolean
  autocompletion?: boolean
  rectangularSelection?: boolean
  crosshairCursor?: boolean
  highlightActiveLine?: boolean
  highlightSelectionMatches?: boolean

  closeBracketsKeymap?: boolean
  searchKeymap?: boolean
  foldKeymap?: boolean
  completionKeymap?: boolean
  lintKeymap?: boolean
}

function minimalSetup(options?: MinimalSetupOptions) => Extension[]
```
