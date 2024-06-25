import { EditorView } from '@codemirror/view'

export type ChatReq = {
  prompt: string
  refContent: string
  extra: any
}

export type ChatRes = {
  status: string
  message: string
  extra?: any
}

export type AiWidgetOptions = {
  hotkey?: string // default is 'Mod-i'

  chat: (view: EditorView, req: ChatReq) => Promise<ChatRes>
  cancelChat: () => void

  onEvent?: (view: EditorView, type: string, payload?: any) => void

  getDbList: () => string[] // for auto add `use {db};` statement if miss it
}
