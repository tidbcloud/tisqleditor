import { EditorView } from '@codemirror/view'

export type ChatReq = {
  prompt: string
  refContent: string
  extra?: {}
}

export type ChatRes = {
  status: 'success' | 'error'
  message: string
  extra?: {}
}

type EventType =
  | 'widget.open' // {source: 'hotkey' | 'fix_sql_button' | ...}
  | 'no_use_db.error'
  | 'req.send' // {chatReq}
  | 'req.cancel' // {chatReq}
  | 'req.success' // {chatReq, chatRes, duration}
  | 'req.error' // {chatReq, chatRes, duration}
  | 'accept.click' // {chatReq, chatRes}
  | 'discard.click' // {chatReq, chatRes}
  | 'gen.click' // {chatReq, chatRes}
  | 'add_use_db.click'
  | 'close' // {by: 'esc_key' | 'icon'}

export type AiWidgetOptions = {
  /* hotkey to trigger ai widget, default is 'Mod-i' */
  hotkey?: string

  /* prompt input wordings */
  /* default: 'AI results may be incorrect' */
  promptInputTipsNormal?: string
  /* default: 'Fetching results...' */
  promptInputTipsRequesting?: string
  /* default: 'Ask AI to write anything...' */
  promptInputPlaceholderNormal?: string
  /* default: 'Error occurred. Please try to regenerate or input another instruction.' */
  promptInputPlaceholderError?: string

  /* chat with AI */
  chat: (view: EditorView, chatId: string, req: ChatReq) => Promise<ChatRes>
  cancelChat: (chatId: string) => void

  /* event call, for telemetry if you need */
  onEvent?: (view: EditorView, type: EventType, payload?: {}) => void

  /* for auto add `use {db};` statement if miss it */
  getDbList: () => string[]
}
