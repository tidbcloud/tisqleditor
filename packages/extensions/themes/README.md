# @tidbcloud/tisqleditor-extension-themes

This extension provides 2 simple and out of box editor theme to use, one is for light mode and the other is for dark mode.

If these 2 theme is not suitable for you, you can use other themes from third-party libraries or customized a theme by yourself.

## Installation

```shell
npm install @tidbcloud/tisqleditor-extension-themes
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/language @lezer/highlight
```

## Usage

```js
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { bbedit, oneDark } from '@tidbcloud/tisqleditor-extension-themes'

const isDark: boolean
const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [isDark ? oneDark : bbedit]
  })
})
```
