import { useMemo } from 'react'
import { ChatReq, EventType } from '@tidbcloud/codemirror-extension-ai-widget'

import { cancelChat, chat2data, refineSql } from '@/api/tidbcloud/chat-api'
import { ChatContext } from './chat-context'

function chat(chatId: string, req: ChatReq) {
  if (req.refContent === '') {
    return chat2data(chatId, {
      database: req.extra?.db ?? '',
      question: req.prompt
    })
  }
  return refineSql(chatId, {
    database: req.extra?.db ?? '',
    feedback: req.prompt,
    sql: req.refContent
  })
}

function onEvent(event: EventType, payload?: {}) {
  console.log('event:', event)
  console.log('payload:', payload)
}

export function ChatProvider(props: { children: React.ReactNode }) {
  const ctxValue = useMemo(
    () => ({
      chat,
      cancelChat,
      onEvent
    }),
    []
  )

  return (
    <ChatContext.Provider value={ctxValue}>
      {props.children}
    </ChatContext.Provider>
  )
}
