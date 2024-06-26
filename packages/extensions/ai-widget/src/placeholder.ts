import { Extension } from '@codemirror/state'
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType
} from '@codemirror/view'

import { activePromptInput, isPromptInputActive } from './prompt-input'
import { isAppleOs } from './utils'

const aiPlaceholderTheme = EditorView.baseTheme({
  '.cm-ai-placeholder': {
    fontSize: '12px',
    paddingLeft: '8px',
    '& span': {
      color: '#0CA6F2',
      cursor: 'pointer'
    }
  },
  '&light .cm-ai-placeholder': {
    color: '#bbb'
  },
  '&dark .cm-ai-placeholder': {
    color: '#c6c6c6'
  },
  '&.cm-focused .cm-cursor.cm-ai-placeholder-cursor': {
    // borderLeft: '3px solid #0CA6F2'
  }
})

class AIPlaceholderWidget extends WidgetType {
  constructor(public emptyDoc: boolean) {
    super()
  }

  toDOM(view: EditorView): HTMLElement {
    const cmd = isAppleOs ? 'Command' : 'Ctrl'

    const root = document.createElement('span')
    root.className = 'cm-ai-placeholder'
    if (this.emptyDoc) {
      // TODO: make it configurable
      root.innerHTML = `Press '${cmd}' + 'I' or <span>click here</span> to use Chat2Query.`
    } else {
      // TODO: make it configurable
      root.innerHTML = `Press '${cmd}' + 'I' to use Chat2Query.`
    }
    const btn = root.querySelector('span')
    if (btn) {
      btn.onclick = () => {
        activePromptInput(view)
      }
    }

    const cursorEl = document.querySelector(
      '.cm-cursorLayer .cm-cursor'
    ) as HTMLDivElement
    if (cursorEl) {
      cursorEl.classList.add('cm-ai-placeholder-cursor')
    }

    return root
  }

  destroy(_dom: HTMLElement): void {
    const cursorEl = document.querySelector(
      '.cm-cursorLayer .cm-cursor'
    ) as HTMLDivElement
    if (cursorEl) {
      cursorEl.classList.remove('cm-ai-placeholder-cursor')
    }
  }
}

// container for placeholder widget
const aiPlaceholderPlugin = ViewPlugin.fromClass(
  class {
    placeholder: DecorationSet = Decoration.none

    updatePlaceholder() {
      this.placeholder = Decoration.none

      // if (isPromptInputActive(this.view)) return
      // if (isUnifiedMergeViewActive(this.view)) return;

      if (this.view.state.doc.length === 0) {
        this.placeholder = Decoration.set([
          Decoration.widget({
            widget: new AIPlaceholderWidget(true),
            side: 1
          }).range(0)
        ])
      } else {
        // selection
        const { from, to } = this.view.state.selection.main
        const line = this.view.state.doc.lineAt(from)
        // must be empty line
        if (line.length === 0 && from === to) {
          // a simple way to check last ';'
          const beforeText = this.view.state
            .sliceDoc(Math.max(0, from - 100), from)
            .trim()
          if (beforeText.endsWith(';')) {
            this.placeholder = Decoration.set([
              Decoration.widget({
                widget: new AIPlaceholderWidget(false),
                side: 1
              }).range(from)
            ])
          }
        }
      }
    }

    constructor(readonly view: EditorView) {
      this.updatePlaceholder()
    }

    update(v: ViewUpdate) {
      // hide placeholder when prompt input is active
      if (isPromptInputActive(this.view.state)) {
        this.placeholder = Decoration.none
        return
      }

      if (v.selectionSet) {
        this.updatePlaceholder()
      }
    }

    get decorations() {
      return this.placeholder
    }
  },
  { decorations: (v) => v.decorations }
)

export function aiPlaceholder(): Extension {
  return [aiPlaceholderTheme, aiPlaceholderPlugin]
}
