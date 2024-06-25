import { Extension } from '@codemirror/state'

import { aiPromptInput } from './prompt-input'
import { AiWidgetOptions } from './type'

export function aiWidget(options: AiWidgetOptions): Extension {
  return [aiPromptInput(options)]
}

export * from './prompt-input'
