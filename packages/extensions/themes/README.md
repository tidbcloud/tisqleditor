# @tidbcloud/codemirror-extension-themes

Codemirror theme extensions, provide 2 simple and out of box editor themes to use, `bbedit` is for light mode and `oneDark` is for dark mode.

If these 2 themes are not suitable for you, you can choose other themes from third-party libraries or customized a theme by yourself.

## Installation

```shell
npm install @tidbcloud/codemirror-extension-themes
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/language @lezer/highlight
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { bbedit, oneDark } from '@tidbcloud/codemirror-extension-themes'

const isDark: boolean
const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [isDark ? oneDark : bbedit]
  })
})
```
