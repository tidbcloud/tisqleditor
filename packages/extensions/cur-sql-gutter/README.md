# @tidbcloud/tisqleditor-extension-cur-sql-gutter

This extension listens the editor selection change, and shows gutter for the selected statements to make it highlight.

## Installation

```shell
npm install @tidbcloud/tisqleditor-extension-cur-sql-gutter
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state
```

## Usage

```js
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { curSqlGutter } from '@tidbcloud/tisqleditor-extension-cur-sql-gutter'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [curSqlGutter()]
  })
})
```

## API

```js
interface CurSqlGutterConfig {
    // gutter background
    backgroundColor?: string;

    // gutter width
    width?: number;

    // gutter extra css class
    className?: string;

    // control gutter to hide when some cases happen
    whenHide?: (view: EditorView) => boolean;
}

const curSqlGutter: (config?: CurSqlGutterConfig) => Extension;
```
