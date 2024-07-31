import { createContext, useContext } from 'react'

import {
  ChatReq,
  ChatRes,
  EventType
} from '@tidbcloud/codemirror-extension-ai-widget'

type ChatCtxValue = {
  chat: (chatId: string, req: ChatReq) => Promise<ChatRes>
  cancelChat: (chatId: string) => void
  onEvent: (event: EventType, payload?: {}) => void
}

export const ChatContext = createContext<ChatCtxValue | null>(null)

export const useChatContext = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatContext must be used within a provider')
  }

  return context
}
