# @tidbcloud/codemirror-extension-events

Events extensions for CodeMirror6. This extension provides 3 default events: onChange, onFocusChange and onSelectionChange.
onChange: any doc change will trigger this event
onFocusChange: while the cursor change will trigger this event
onSelectionChange: while selection content change will trigger this event

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
import { onChange, onFocusChange, onSelectionChange } from '@tidbcloud/codemirror-extension-events'

const onChangeHandler = (sql: string, view: EditorView) => {
  console.log(sql, view)
}

const onFocusChangeHandler = (sql: string) => {
  console.log(sql)
}

const onSelectionChangeHandler = (selectedRange: {from: number, to: numer}) => {
  console.log(selectedRange.from, selectedRange.to)
}

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      onChange(onChangeHandler),
      focusChangeHelper(onFocusChangeHandler),
      onSelectionChange: (onSelectionChangeHandler)
    ]
  })
})
```
