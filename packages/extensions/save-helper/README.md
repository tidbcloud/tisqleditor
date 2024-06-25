# @tidbcloud/codemirror-extension-save-helper

This extension listens the editor doc changes, if changes, it will call the save handler in delay time, or, you can press the defined hotkey (default is `Mod-s`) to call save handler immediately.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-save-helper
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { saveHelper } from '@tidbcloud/codemirror-extension-save-helper'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      saveHelper({
        save: (view: EditorView) => {
          saveFile(view.state.doc.toString())
        }
      })
    ]
  })
})
```

## API

```ts
type SaveHelperOptions = {
  /* in milliseconds, default 5000 */
  delay?: number

  /* default is true */
  auto?: boolean

  /* default is Mod-s */
  hotkey?: string

  /* save handler */
  save: (view: EditorView) => void
}

const saveHelper: (options: SaveHelperOptions) => Extension
```
