import { getChunks, rejectChunk, unifiedMergeView } from '@codemirror/merge'
import { Compartment, EditorState, Extension, Prec } from '@codemirror/state'
import {
  Decoration,
  DecorationSet,
  EditorView,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
  keymap
} from '@codemirror/view'

import {
  getCurDatabase,
  getFirstNonUseTypeStatement
} from '@tidbcloud/codemirror-extension-cur-sql'

import {
  ICON_ERROR,
  ICON_LOADING,
  ICON_PROMPT,
  ICON_SEND,
  ICON_STOP,
  ICON_CLOSE
} from './icons-svg'
import { promptInputTheme } from './prompt-input-theme'
import { AiWidgetOptions, ChatReq, ChatRes } from './type'

//------------------------------------------

const inputPluginCompartment = new Compartment()
const unifiedMergeViewCompartment = new Compartment()

type Pos = { from: number; to: number }

//------------------------------------------

export function isPromptInputActive(state: EditorState) {
  return inputPluginCompartment.get(state) instanceof ViewPlugin
}

export function isUnifiedMergeViewActive(state: EditorState) {
  return (unifiedMergeViewCompartment.get(state) as Extension[]).length > 0
}

// this method triggers the AI widget to show.
// this method can be called by hotkey (default is `Mod-i`), or from outside of the editor.
// for example, a SQL statement is ran failed, then we can show a button with text "Fix SQL error" in the result panel,
// after clicking the button, it will call this method, trigger the AI widget, auto chat with AI with the prompt "Fix this SQL" immediately
// the method is called may like this from outside: `activePromptInput(view, "Fix this SQL", true, "fix_sql_button", {from: 100, to: 200})`
export function activePromptInput(
  view: EditorView,
  defPrompt: string = '',
  immediate: boolean = false,
  source: string = 'hotkey', // this value maybe: 'hotkey', 'fix_sql_button'...
  pos?: Pos
) {
  if (isUnifiedMergeViewActive(view.state)) {
    rejectChunks(view)
  }

  // update the selection pos
  let { from, to } = view.state.selection.main
  // the pos comes from external (for example, a button to fix sql error), and the value is precise, use it directly
  if (pos) {
    from = pos.from
    to = pos.to
  } else {
    // 1. when select a part of sql statement, the selection will expand to the whole statement
    // 2. when select a part of multiple sql statements, the selection will expand to the whole first statement that is not `use` type
    const firstStatement = getFirstNonUseTypeStatement(view.state)
    if (firstStatement) {
      from = firstStatement.from
      to = firstStatement.to
    }
  }

  // update the selection
  const line = view.state.doc.lineAt(from)
  if (line.from === 0) {
    // a hack
    // insert a new line at the beginning of the doc,
    // to avoid the prompt input widget render issue at the beginning
    view.dispatch({
      changes: { from: 0, insert: '\n' },
      selection: {
        anchor: from + 1,
        head: to + 1
      }
    })
  } else {
    view.dispatch({
      selection: {
        anchor: from,
        head: to
      }
    })
  }

  view.dispatch({
    effects: inputPluginCompartment.reconfigure([])
  })
  view.dispatch({
    effects: inputPluginCompartment.reconfigure(
      inputPlugin(defPrompt, immediate)
    )
  })

  const { onEvent } = aiWidgetOptions
  onEvent?.(view, 'widget.open', { source })
}

export function unloadPromptPlugins(view: EditorView) {
  view.dispatch({
    effects: [
      unifiedMergeViewCompartment.reconfigure([]),
      inputPluginCompartment.reconfigure([])
    ]
  })
}

//------------------------------------------

function getRefContent(view: EditorView, pos: Pos) {
  return view.state.doc.sliceString(pos.from, pos.to)
}

function replaceSelection(view: EditorView, pos: Pos, content: string) {
  const oriDoc = view.state.doc.toString()

  view.dispatch({
    changes: { from: pos.from, to: pos.to, insert: content },
    selection: {
      anchor: pos.from,
      head: pos.from + content.length
    },
    userEvent: 'ai.replace'
  })

  view.dispatch({
    effects: unifiedMergeViewCompartment.reconfigure(
      unifiedMergeView({
        original: oriDoc,
        highlightChanges: false,
        gutter: true,
        syntaxHighlightDeletions: true,
        mergeControls: false
      })
    )
  })
}

export function rejectChunks(view: EditorView) {
  const chunks = getChunks(view.state)?.chunks || []
  // must traverse from the last to the first
  for (let i = chunks.length - 1; i >= 0; i--) {
    // rejectChunk(view, chunks[i].fromB, false)
    rejectChunk(view, chunks[i].fromB)
  }
}

// recover the previous selection when trigger regenerate
// side effect: causes the tooltip hint render issue
export function recoverSelection(view: EditorView, pos: Pos) {
  const { from, to } = pos

  view.dispatch({
    selection: {
      anchor: from,
      head: to
    }
  })
}

function moveCursorAfterAccept(view: EditorView) {
  const { to } = view.state.selection.main
  view.dispatch({ selection: { anchor: to, head: to } })
}

//------------------------------------------

// TODO: these contents should be configurable
const PROMPT_TIPS_NORMAL = 'Chat2Query results may be incorrect'
const PROMPT_TIPS_REQUESTING = 'Fetching results...'
const PROMPT_PLACEHOLDER_NORMAL = 'Ask Chat2Query to write anything...'
const PROMPT_PLACEHOLDER_ERROR =
  'Error occurred. Please try to regenerate or click here to enter another instruction.'

type PromptInputStatus =
  | 'normal'
  | 'no_use_db_error'
  | 'requesting'
  | 'req_success'
  | 'req_error'

class PromptInputWidget extends WidgetType {
  // destroy() and toDOM() may be called many times in the widget lifecycle, but this widget self won't be destroyed
  // so you need to store the state inside PromptInputWidget object, not inside toDOM method
  private status: PromptInputStatus = 'normal'
  private inputPrompt: string = ''

  private chatId: string = ''
  private chatReq: ChatReq | null = null
  private chatRes: ChatRes | null = null

  // the pos is the selection when the widget is created
  constructor(
    public oriSelPos: Pos,
    public defPrompt: string,
    public immediate: boolean
  ) {
    super()
  }

  toDOM(view: EditorView): HTMLElement {
    // root element
    const root = document.createElement('div')
    root.className = 'cm-ai-prompt-input-root'
    root.innerHTML = `
      <form>
        <span class="cm-ai-prompt-input-icon cm-ai-prompt-input-icon-left">
          ${ICON_PROMPT}
        </span>
        <input placeholder="${PROMPT_PLACEHOLDER_NORMAL}" value="${this.defPrompt}" />
        <button class="cm-ai-prompt-input-icon cm-ai-prompt-input-icon-right">
          ${ICON_SEND}
        </button>
        <button class="cm-ai-prompt-input-icon cm-ai-prompt-input-icon-close">
          ${ICON_CLOSE}
        </button>
      </form>
      <span class="cm-ai-prompt-input-tips">${PROMPT_TIPS_NORMAL}</span>
      <div class="cm-ai-prompt-input-actions">
        <button id="cm-ai-prompt-btn-accept">Accept</button>
        <button id="cm-ai-prompt-btn-discard">Discard</button>
        <button id="cm-ai-prompt-btn-gen">Regenerate</button>
        <button id="cm-ai-prompt-btn-add-use-db">Add "use {db};"</button>
      </div>
    `

    // elements
    const form = root.querySelector('form') as HTMLFormElement
    const input = form.querySelector('input') as HTMLInputElement
    const leftIcon = form.querySelector(
      'span.cm-ai-prompt-input-icon-left'
    ) as HTMLSpanElement
    const rightIcon = form.querySelector(
      'button.cm-ai-prompt-input-icon-right'
    ) as HTMLButtonElement
    const closeIcon = root.querySelector(
      'button.cm-ai-prompt-input-icon-close'
    ) as HTMLButtonElement

    const tips = root.querySelector(
      'span.cm-ai-prompt-input-tips'
    ) as HTMLSpanElement

    const actionBtns = root.querySelector(
      'div.cm-ai-prompt-input-actions'
    ) as HTMLDivElement
    const acceptBtn = root.querySelector(
      'button#cm-ai-prompt-btn-accept'
    ) as HTMLButtonElement
    const discardBtn = root.querySelector(
      'button#cm-ai-prompt-btn-discard'
    ) as HTMLButtonElement
    const genBtn = root.querySelector(
      'button#cm-ai-prompt-btn-gen'
    ) as HTMLButtonElement
    const addUseDbBtn = root.querySelector(
      'button#cm-ai-prompt-btn-add-use-db'
    ) as HTMLButtonElement

    // status
    // normal status is the initial status
    const normalStatus = () => {
      leftIcon.innerHTML = ICON_PROMPT
      leftIcon.classList.remove('rotate')

      rightIcon.innerHTML = ICON_SEND

      input.value = this.defPrompt
      input.placeholder = PROMPT_PLACEHOLDER_NORMAL

      tips.style.display = 'flex'
      tips.innerText = PROMPT_TIPS_NORMAL

      actionBtns.style.display = 'none'

      this.status = 'normal'
    }
    const requestingStatus = () => {
      normalStatus()

      leftIcon.innerHTML = ICON_LOADING
      leftIcon.classList.add('rotate')

      rightIcon.innerHTML = ICON_STOP

      input.value = this.inputPrompt

      tips.innerText = PROMPT_TIPS_REQUESTING

      this.status = 'requesting'
    }
    const reqSuccessStatus = () => {
      normalStatus()

      input.value = this.inputPrompt

      tips.style.display = 'none'

      actionBtns.style.display = 'flex'
      addUseDbBtn.style.display = 'none'

      this.status = 'req_success'
    }
    const reqErrorStatus = (msg: string) => {
      normalStatus()

      leftIcon.innerHTML = ICON_ERROR

      input.value = ''
      input.placeholder = msg || PROMPT_PLACEHOLDER_ERROR

      tips.style.display = 'none'

      actionBtns.style.display = 'flex'
      acceptBtn.style.display = 'none'
      discardBtn.style.display = 'none'
      addUseDbBtn.style.display = 'none'

      this.status = 'req_error'
    }
    const noUseDBStatus = () => {
      reqErrorStatus('Please write an "use {db};" SQL first!')

      genBtn.style.display = 'none'
      addUseDbBtn.style.display = 'initial'

      this.status = 'no_use_db_error'
    }

    const { chat, cancelChat, onEvent, getDbList } = aiWidgetOptions

    // event handlers
    const handleRequest = async () => {
      if (this.status === 'requesting') {
        return
      }

      if (isUnifiedMergeViewActive(view.state)) {
        rejectChunks(view)
        recoverSelection(view, this.oriSelPos)
      }

      requestingStatus()

      const refContent = getRefContent(view, this.oriSelPos)
      this.chatId = crypto.randomUUID()
      this.chatReq = {
        prompt: this.inputPrompt,
        refContent,
        extra: {}
      }
      onEvent?.(view, 'req.send', { chatReq: this.chatReq })
      const start = performance.now()
      const res = await chat(view, this.chatId, this.chatReq)
      const duration = performance.now() - start
      this.chatRes = res

      if (res.status === 'success') {
        replaceSelection(view, this.oriSelPos, res.message)
        reqSuccessStatus()
      } else if (res.status === 'error') {
        reqErrorStatus(res.message)
      }
      onEvent?.(view, `req.${res.status}`, {
        chatReq: this.chatReq,
        chatRes: this.chatRes,
        duration
      })
    }

    // event listeners
    root.onclick = (e) => {
      e.preventDefault()
    }
    form.onsubmit = async (e) => {
      e.preventDefault()
      this.inputPrompt = input.value
      if (this.inputPrompt.length === 0) {
        return
      }
      await handleRequest()
    }
    rightIcon.onclick = () => {
      if (!getCurDatabase(view.state)) {
        noUseDBStatus()
        return
      }

      if (this.status === 'requesting') {
        onEvent?.(view, 'req.cancel', { chatReq: this.chatReq })
        rejectChunks(view)

        cancelChat(this.chatId)
        normalStatus()
        recoverSelection(view, this.oriSelPos)
        this.chatRes = null
      } else {
        form.requestSubmit()
      }
    }
    closeIcon.onclick = () => {
      onEvent?.(view, 'close', { by: 'icon' })
      normalStatus()
      cancelChat(this.chatId)

      if (isUnifiedMergeViewActive(view.state)) {
        rejectChunks(view)
        recoverSelection(view, this.oriSelPos)
      }

      unloadPromptPlugins(view)
      view.focus()
    }
    acceptBtn.onclick = () => {
      onEvent?.(view, 'accept.click', {
        chatReq: this.chatReq,
        chatRes: this.chatRes
      })
      unloadPromptPlugins(view)

      moveCursorAfterAccept(view)
      view.focus()
    }
    discardBtn.onclick = () => {
      onEvent?.(view, 'discard.click', {
        chatReq: this.chatReq,
        chatRes: this.chatRes
      })
      rejectChunks(view)
      recoverSelection(view, this.oriSelPos)
      unloadPromptPlugins(view)
      view.focus()
    }
    genBtn.onclick = async () => {
      onEvent?.(view, 'gen.click', {
        chatReq: this.chatReq,
        chatRes: this.chatRes
      })
      await handleRequest()
    }
    addUseDbBtn.onclick = () => {
      onEvent?.(view, 'add_use_db.click')

      normalStatus()

      const userDbList = getDbList()
      const firstDb = userDbList[0] ?? 'databaseNameHere'
      const { from, to } = view.state.selection.main
      const insertContent = `${from === 1 ? '' : '\n'}use ${firstDb};\n`
      // update this.oriSelPos
      this.oriSelPos = {
        from: from + insertContent.length,
        to: to + insertContent.length
      }
      // update content and selection
      view.dispatch({
        changes: { from: from - 1, insert: insertContent },
        selection: {
          anchor: this.oriSelPos.from,
          head: this.oriSelPos.to
        },
        userEvent: 'add.use_db'
      })

      // can't continue if there is no correct database used
      if (userDbList.length === 0) {
        unloadPromptPlugins(view)
        view.dispatch({
          selection: {
            anchor: from + insertContent.length - 2
          }
        })
        view.focus()
      }
    }

    //----

    setTimeout(() => {
      const end = input.value.length
      input.setSelectionRange(end, end)
      input.focus()

      if (!getCurDatabase(view.state)) {
        onEvent?.(view, 'no_use_db.error')
        noUseDBStatus()
        return
      }

      if (this.immediate && !this.chatReq) {
        form.requestSubmit()
        return
      }

      // recover widget status when the widget is re-render, aka, toDOM is re-run
      if (this.status === 'normal') {
        normalStatus()
      } else if (this.status === 'no_use_db_error') {
        noUseDBStatus()
      } else if (this.status === 'requesting') {
        requestingStatus()
      } else if (this.status === 'req_success') {
        reqSuccessStatus()
      } else if (this.status === 'req_error') {
        reqErrorStatus(this.chatRes!.message)
      }
    }, 100)

    return root
  }

  ignoreEvent() {
    // when true, widget handles events by self and stop propagation
    // when false, let inputPlugin to handle events in the `eventHandlers`
    return true
  }

  destroy(_dom: HTMLElement): void {}
}

const inputPlugin = (defPrompt: string, immediate: boolean) =>
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet

      constructor(view: EditorView) {
        let { from, to } = view.state.selection.main
        const line = view.state.doc.lineAt(from)

        // show the widget before the selection head
        let pos = line.from - 1
        if (pos < 0) {
          throw new Error('pos < 0')
        }

        this.decorations = Decoration.set([
          Decoration.widget({
            widget: new PromptInputWidget({ from, to }, defPrompt, immediate),
            side: 1
            // block: true, // totally doesn't work
          }).range(pos)
        ])
      }

      update(v: ViewUpdate) {
        // update the decoration pos if content changes
        // for example: after clicking `Add use {db};` button to insert new content before the widget
        this.decorations = this.decorations.map(v.changes)
      }
    },
    {
      decorations: (v) => v.decorations
    }
  )

//------------------------------------------

const promptInputKeyMaps = (hotkey?: string) =>
  Prec.highest(
    keymap.of([
      {
        key: hotkey || 'Mod-i',
        run: (view) => {
          if (getFirstNonUseTypeStatement(view.state)) {
            activePromptInput(view)
          }
          // must return true to prevent propagation
          // not sure where others register this key map as well
          return true
        }
      }
    ])
  )

// after triggering the AI prompt input widget,
// not allow the user to change the selection
const selChangeListener = EditorState.transactionFilter.of((tr) => {
  if (
    !isPromptInputActive(tr.startState) ||
    !tr.selection ||
    tr.isUserEvent('ai.replace') ||
    // https://github.com/codemirror/merge/blob/main/src/unified.ts
    tr.isUserEvent('accept') ||
    tr.isUserEvent('revert') ||
    tr.isUserEvent('add.use_db')
  ) {
    return tr
  }
  return []
})

const inputListener = EditorView.inputHandler.of((update) => {
  if (isPromptInputActive(update.state)) {
    // add a shake css when user type something while the prompt input is active
    const inputEle = document.querySelector('.cm-ai-prompt-input-root')
    if (inputEle) {
      inputEle.classList.add('shake')

      setTimeout(() => {
        inputEle.classList.remove('shake')
      }, 1000)
    }
  }
  return false
})

//------------------------------------------

let aiWidgetOptions: AiWidgetOptions

export function aiPromptInput(options: AiWidgetOptions): Extension {
  aiWidgetOptions = options

  return [
    inputPluginCompartment.of([]),
    unifiedMergeViewCompartment.of([]),
    promptInputTheme,
    promptInputKeyMaps(options.hotkey),
    selChangeListener,
    inputListener
  ]
}
