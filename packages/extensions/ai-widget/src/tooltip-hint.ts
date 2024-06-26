import {
  EditorState,
  Extension,
  Prec,
  StateEffect,
  StateField
} from '@codemirror/state'
import { EditorView, Tooltip, keymap, showTooltip } from '@codemirror/view'

import { getFirstNonUseTypeStatement } from '@tidbcloud/codemirror-extension-cur-sql'

import { getAiWidgetOptions, isPromptInputActive } from './prompt-input'
import { isAppleOs } from './utils'

//------------------------------------------

const cursorTooltipBaseTheme = EditorView.baseTheme({
  '.cm-tooltip.cm-ai-tooltip-cursor': {
    fontSize: '12px',
    fontWeight: 500,
    borderRadius: '8px',
    padding: '16px',
    '& code': {
      borderRadius: '4px',
      padding: '4px 6px',
      '& b': {
        fontWeight: 'bold'
      }
    }
  },
  '&light .cm-tooltip.cm-ai-tooltip-cursor': {
    backgroundColor: '#fff',
    color: '#555',
    border: '1px solid #EDEDED',
    boxShadow: '0px 8px 32px 0px rgba(0, 0, 0, 0.08)'
  },
  '&light .cm-tooltip.cm-ai-tooltip-cursor code': {
    border: '1px solid #E6E6E6',
    backgroundColor: '#F9F9F9'
  },
  '&dark .cm-tooltip.cm-ai-tooltip-cursor': {
    backgroundColor: '#222',
    color: '#c6c6c6',
    border: '1px solid #393939',
    boxShadow: '0px 8px 32px 0px rgba(0, 0, 0, 0.08)'
  },
  '&dark .cm-tooltip.cm-ai-tooltip-cursor code': {
    border: '1px solid #333',
    backgroundColor: '#1a1a1a'
  }
})

//------------------------------------------

function getCursorTooltips(state: EditorState): readonly Tooltip[] {
  const cmd = isAppleOs ? 'Command' : 'Ctrl'

  return state.selection.ranges
    .filter((range) => !range.empty)
    .map((range) => {
      const pos = range.head
      const line = state.doc.lineAt(pos)
      let delta = pos - line.from
      if (delta > 5) {
        delta = 5
      }
      return {
        pos: range.head,
        above: true,
        create: () => {
          let dom = document.createElement('div')
          dom.className = 'cm-ai-tooltip-cursor'
          dom.innerHTML =
            getAiWidgetOptions().tooltipHintElement ||
            `Press <code><b>${cmd}</b> + <b>I</b></code> to rewrite SQL by AI`
          return { dom, offset: { x: -16 * delta, y: 4 } }
        }
      }
    })
}

const cursorTooltipField = StateField.define<readonly Tooltip[]>({
  create: getCursorTooltips,

  update(tooltips, tr) {
    for (let effect of tr.effects) {
      if (effect.is(enableTooltipEffect)) {
        if (effect.value) {
          return getCursorTooltips(tr.state)
        } else {
          return []
        }
      }
    }
    return tooltips
  },

  provide: (f) => showTooltip.computeN([f], (state) => state.field(f))
})

//------------------------------------------

const enableTooltipEffect = StateEffect.define<boolean>()

export function hideTooltip(view: EditorView) {
  view.dispatch({
    effects: enableTooltipEffect.of(false)
  })
}

// dismiss tooltip when press ai-widget hotkey (default is 'Mod-i')
const hideTooltipKeymap = (hotkey?: string) =>
  Prec.highest(
    keymap.of([
      {
        key: hotkey || 'Mod-i',
        run: (view) => {
          if (view.state.field(cursorTooltipField).length !== 0) {
            hideTooltip(view)
          }
          return false
        }
      }
    ])
  )

const selectionChangeListener = () => {
  let timer: number | undefined
  let preFrom = -1
  let preTo = -1

  return EditorView.updateListener.of((update) => {
    if (!update.selectionSet) return

    const { from, to } = update.view.state.selection.main
    if (from === preFrom && to === preTo) return
    preFrom = from
    preTo = to

    // dismiss the previous tooltip immediately
    if (from === to) {
      hideTooltip(update.view)
      return
    }

    // debounce
    timer && clearTimeout(timer)
    // delay to show the tooltip
    timer = window.setTimeout(() => {
      if (isPromptInputActive(update.view.state)) return
      if (!getFirstNonUseTypeStatement(update.view.state)) return

      update.view.dispatch({
        effects: enableTooltipEffect.of(true)
      })
    }, 500)
  })
}

//------------------------------------------

export function aiCursorTooltip(hotkey?: string): Extension {
  return [
    cursorTooltipBaseTheme,
    hideTooltipKeymap(hotkey),
    cursorTooltipField,
    selectionChangeListener()
  ]
}
