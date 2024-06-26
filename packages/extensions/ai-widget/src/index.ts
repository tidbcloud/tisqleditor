import { Extension } from '@codemirror/state'

import { AiWidgetOptions } from './type'
import { escapeListener } from './esc-listener'
import { aiPlaceholder } from './placeholder'
import { aiCursorTooltip } from './tooltip-hint'
import { aiPromptInput } from './prompt-input'

export function aiWidget(options: AiWidgetOptions): Extension {
  return [
    escapeListener,
    aiPlaceholder(),
    aiCursorTooltip(options.hotkey),
    aiPromptInput(options)
  ]
}

export * from './prompt-input'
export * from './type'
