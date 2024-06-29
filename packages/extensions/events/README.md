# @tidbcloud/codemirror-extension-events

2 normal kinds of event listener: doc change, selection change

- onDocChange: triggered when doc changes
- onSelectionChange: triggered when selection changes

## Installation

```shell
npm install @tidbcloud/codemirror-extension-events
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import {
  onDocChange,
  onSelectionChange,
  SelectionRange
} from '@tidbcloud/codemirror-extension-events'

const docChangeHandler = (view: EditorView, doc: string) => {
  console.log(doc)
}

const selectionChangeHandler = (view: EditorView, ranges: SelectionRange[]) => {
  console.log(ranges)
}

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      onDocChange(docChangeHandler),
      onSelectionChange(selectionChangeHandler)
    ]
  })
})
```

## API

```ts
type DocChangeHandler = (view: EditorView, content: string) => void
function onDocChange(handler: DocChangeHandler): Extension

type SelectionRange = {
  from: number
  to: number
}
type SelectionChangeHandler = (
  view: EditorView,
  selRanges: SelectionRange[]
) => void
function onSelectionChange(handler: SelectionChangeHandler): Extension
```
