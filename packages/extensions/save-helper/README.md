# @tidbcloud/tisqleditor-extension-save-helper

This extension listens the editor doc changes, if changes, it will call the save handler in delay time, or, you can press the defined hotkey (default is `Mod-s`) to call save handler immediately.

## Installation

```shell
npm install @tidbcloud/tisqleditor-extension-save-helper
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state
```

## Usage

```js
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { saveHelper } from '@tidbcloud/tisqleditor-extension-save-helper'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      saveHelper({
        save: (view: EditorView) => {
          saveFile(view.state.doc.toString())
        }
      }),
    ]
  })
})
```

## API

```js
type SaveHelperOptions = {
  delay?: number                    // in milliseconds, default 5000
  auto?: boolean                    // default is true
  hotkey?: string                   // default is Mod-s
  save: (view: EditorView) => void  // save handler
}

const saveHelper: (options: SaveHelperOptions) => Extension
```
