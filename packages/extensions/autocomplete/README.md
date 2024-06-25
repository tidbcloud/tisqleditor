# @tidbcloud/codemirror-extension-autocomplete

// TODO: desc

## Installation

```shell
npm install @tidbcloud/codemirror-extension-autocomplete
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/autocomplete @codemirror/commands
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { autoCompletion } from '@tidbcloud/codemirror-extension-autocomplete'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [autoCompletion()]
  })
})
```

## API

// TODO
