import { Decoration, EditorView, ViewPlugin } from '@codemirror/view'

import { hideTooltip } from './tooltip-hint'

// `Escape` hotkey can't be registered by `keymap.of([])` method
export const escapeListener = ViewPlugin.fromClass(
  class {
    escapeListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // dismiss tooltip
        hideTooltip(this.view)

        // dismiss prompt input widget
        document.dispatchEvent(
          new CustomEvent('dismiss_ai_widget', {
            detail: { source: 'esc_key' }
          })
        )
      }
    }

    constructor(public view: EditorView) {
      document.addEventListener('keydown', this.escapeListener)
    }

    update() {}

    destroy() {
      document.removeEventListener('keydown', this.escapeListener)
    }
  },
  {
    decorations: () => Decoration.none
  }
)
