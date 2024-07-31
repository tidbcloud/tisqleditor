'use client'

import React from 'react'
import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

export function EditorProvider(props: { children: React.ReactNode }) {
  return <EditorCacheProvider>{props.children}</EditorCacheProvider>
}
