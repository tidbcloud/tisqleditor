# @tidbcloud/codemirror-extension-ai-widget

A codemirror extension provides a widget to chat with AI to help you write or refine SQL. (will support to work with other languages later)

https://github.com/tidbcloud/tisqleditor/assets/1284531/46684333-7efa-4925-bf58-9ab3fb45f692

## Features

- Show placeholder when doc is empty or starting write a new SQL statement
- Show tooltip hint when select content
- Easy to use prompt input widget to chat with AI
- Show diff view to compare the result and the original content

## Try it

- [Full Featured Playground](https://tisqleditor-playground.netlify.app/)
- [Simple Example](https://tisqleditor-playground.netlify.app/?example=ai-widget&with_select)

## Installation

```shell
npm install @tidbcloud/codemirror-extension-ai-widget
```

You need to install its dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/merge @codemirror/lang-sql @tidbcloud/codemirror-extension-sql-parser @tidbcloud/codemirror-extension-cur-sql
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, MySQL } from '@codemirror/lang-sql'
import { sqlParser } from '@tidbcloud/codemirror-extension-sql-parser'
import { curSql } from '@tidbcloud/codemirror-extension-cur-sql'
import { aiWidget } from '@tidbcloud/codemirror-extension-ai-widget'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      sql({ dialect: MySQL }),
      sqlParser(),
      curSql(),

      aiWidget({
        chat: async () => {
          // replace it by yourself chat to AI api in production
          await delay(2000)
          return { status: 'success', message: 'select * from test;' }
        },
        cancelChat: () => {},
        getDbList: () => {
          return ['test1', 'test2']
        }
      })
    ]
  })
})
```

## API

```ts
type ChatReq = {
  prompt: string
  refContent: string
  extra?: any
}

type ChatRes = {
  status: 'success' | 'error'
  message: string
  extra?: any
}

type AiWidgetOptions = {
  /* hotkey to trigger ai widget, default is 'Mod-i' */
  hotkey?: string

  /* prompt input configuration */
  /* default: 'AI results may be incorrect' */
  promptInputTipsNormal?: string
  /* default: 'Fetching results...' */
  promptInputTipsRequesting?: string
  /* default: 'Ask AI to write anything...' */
  promptInputPlaceholderNormal?: string
  /* default: 'Error occurred. Please try to regenerate or input another instruction.' */
  promptInputPlaceholderError?: string

  /* placeholder configuration */
  /* default: 'Press 'Command + I' or <span>click here</span> to use AI' */
  placeholderEmptyDocElement?: string
  /* default: 'Press 'Command + I' to use AI' */
  placeholderNormalElement?: string

  /* tooltip hint configuration */
  /* default: 'Press <code><b>Command</b> + <b>I</b></code> to rewrite SQL by AI' */
  tooltipHintElement?: string

  /* chat with AI */
  chat: (view: EditorView, chatId: string, req: ChatReq) => Promise<ChatRes>
  cancelChat: (chatId: string) => void

  /* event callback, for telemetry if you need */
  onEvent?: (view: EditorView, type: EventType, payload?: {}) => void

  /* for auto add `use {db};` statement if miss it */
  getDbList: () => string[]
}

function aiWidget(options: AiWidgetOptions): Extension

/* check whether prompt input widget is active */
function isPromptInputActive(state: EditorState): boolean

/* check whether diff view is active */
function isUnifiedMergeViewActive(state: EditorState): boolean

/* trigger the prompt input widget to show */
function activePromptInput(
  view: EditorView,
  defPrompt?: string,
  immediate?: boolean,
  /* where is this method called from */
  /* the value maybe: 'hotkey', 'placeholder', 'fix_sql_button', ... */
  /* default value is 'hotkey' */
  source?: string,
  pos?: Pos
): void
```
