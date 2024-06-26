import { Extension } from '@codemirror/state'

import { AiWidgetOptions } from './type'
import { aiPromptInput } from './prompt-input'
import { aiCursorTooltip } from './tooltip-hint'

export function aiWidget(options: AiWidgetOptions): Extension {
  return [aiPromptInput(options), aiCursorTooltip(options.hotkey)]
}

export * from './prompt-input'
export * from './type'
