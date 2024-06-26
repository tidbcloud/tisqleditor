# @tidbcloud/codemirror-extension-ai-widget

// TODO: video

## Features

// TODO

## Installation

```shell
npm install @tidbcloud/codemirror-extension-ai-widget
```

You need to install its peer dependencies as well:

```shell
npm install @codemirror/view @codemirror/state @codemirror/merge
```

## Usage

```ts
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { aiWidget } from '@tidbcloud/codemirror-extension-ai-widget'

const editorView = new EditorView({
  state: EditorState.create({
    doc,
    extensions: [
      aiWidget({
        chat: async () => {
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
  extra?: {}
}

type ChatRes = {
  status: 'success' | 'error'
  message: string
  extra?: {}
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

  /* event call, for telemetry if you need */
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

## Try it

Try it in [playground](https://tisqleditor-playground.netlify.app/) or [example](https://tisqleditor-playground.netlify.app/?example=ai-widget)
