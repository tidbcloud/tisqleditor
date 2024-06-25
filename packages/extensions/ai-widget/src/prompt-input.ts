// 1. when select a part of sql statement, the selection will expand to the whole statement
// 2. when select a part of multiple sql statements, the selection will expand to the whole first statement

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

import { getCurStatements } from '@tidbcloud/codemirror-extension-cur-sql'

import {
  ICON_ERROR,
  ICON_LOADING,
  ICON_PROMPT,
  ICON_SEND,
  ICON_STOP,
  ICON_CLOSE
} from './icons-svg'
import { promptInputTheme } from './prompt-input-theme'
import { AiWidgetOptions, ChatRes } from './type'

//------------------------------------------

const inputPluginCompartment = new Compartment()
const unifiedMergeViewCompartment = new Compartment()

type Pos = { from: number; to: number }

//------------------------------------------

function getFirstNonUseTypeStatement(state: EditorState) {
  return getCurStatements(state).find((s) => s.type !== 'use')
}

function getCurDatabase(state: EditorState) {
  const curStatements = getCurStatements(state)
  if (curStatements.length === 0)
    throw new Error('curStatements must not be empty')
  return curStatements[0].database
}

//------------------------------------------

export function isPromptInputActive(state: EditorState) {
  return inputPluginCompartment.get(state) instanceof ViewPlugin
}

export function isUnifiedMergeViewActive(state: EditorState) {
  return (unifiedMergeViewCompartment.get(state) as Extension[]).length > 0
}

export function activePromptInput(
  view: EditorView,
  defPrompt: string = '',
  immediate: boolean = false,
  pos?: Pos
) {
  if (isUnifiedMergeViewActive(view.state)) {
    rejectChunks(view)
  }

  let { from, to } = view.state.selection.main
  // the pos is passed from external (for example, a button to fix sql error), and the value is precise, use it directly
  if (pos) {
    from = pos.from
    to = pos.to
  } else {
    const firstStatement = getFirstNonUseTypeStatement(view.state)
    if (firstStatement) {
      from = firstStatement.from
      to = firstStatement.to
    }
  }

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
  | 'nodb-error'
  | 'requesting'
  | 'req-success'
  | 'req-error'

const initChatRes: ChatRes = {
  status: '',
  message: '',
  extra: {}
}

class PromptInputWidget extends WidgetType {
  private status: PromptInputStatus = 'normal'
  private inputPrompt: string = ''
  private chatRes = initChatRes

  // the pos is the selection when the widget is created
  constructor(
    public pos: Pos,
    public defPrompt: string,
    public immediate: boolean
  ) {
    super()
  }

  // destroy and toDOM may be called many times, but this widget object won't be destroyed
  // so you need to store the state inside PromptInputWidget object, not inside toDOM method
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
        <button id="cm-ai-prompt-btn-add-use">Add "use {db};"</button>
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
    const addUseBtn = root.querySelector(
      'button#cm-ai-prompt-btn-add-use'
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
      input.placeholder = PROMPT_PLACEHOLDER_NORMAL

      tips.innerText = PROMPT_TIPS_REQUESTING

      this.status = 'requesting'
    }
    const reqSuccessStatus = () => {
      normalStatus()

      tips.style.display = 'none'

      actionBtns.style.display = 'flex'
      addUseBtn.style.display = 'none'

      this.status = 'req-success'
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
      addUseBtn.style.display = 'none'

      this.status = 'req-error'
    }
    const noUseDBStatus = () => {
      reqErrorStatus('Please write an "use {db};" first!')

      genBtn.style.display = 'none'
      addUseBtn.style.display = 'initial'

      this.status = 'nodb-error'
    }

    const { chat, cancelChat, onEvent, getDbList } = aiWidgetOptions

    // event handlers
    const handleRequest = async () => {
      if (this.status === 'requesting') {
        return
      }

      if (isUnifiedMergeViewActive(view.state)) {
        rejectChunks(view)
        recoverSelection(view, this.pos)
      }

      requestingStatus()

      const refContent = getRefContent(view, this.pos)
      const res = await chat(view, {
        prompt: this.inputPrompt,
        refContent,
        extra: {}
      })
      this.chatRes = res

      if (res.status === 'success') {
        replaceSelection(view, this.pos, res.message)
        reqSuccessStatus()
      } else if (res.status === 'error') {
        reqErrorStatus(res.message)
      }

      return res.status === 'success'
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

      const start = Date.now()
      const ret = await handleRequest()
      onEvent?.(view, 'generate', {
        prompt: this.inputPrompt,
        duration: Date.now() - start,
        success: ret
      })
    }
    addUseBtn.onclick = () => {
      normalStatus()

      onEvent?.(view, 'add.use_db')

      const userDbList = getDbList()
      const firstDb = userDbList[0] ?? 'databaseNameHere'
      const { from, to } = view.state.selection.main
      const insertContent = `${from === 1 ? '' : '\n'}use ${firstDb};\n`
      this.pos = {
        from: from + insertContent.length,
        to: to + insertContent.length
      }
      view.dispatch({
        changes: { from: from - 1, insert: insertContent },
        selection: {
          anchor: this.pos.from,
          head: this.pos.to
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
    rightIcon.onclick = () => {
      if (!getCurDatabase(view.state)) {
        onEvent?.(view, 'use_db.send')
        noUseDBStatus()
        return
      }

      if (this.status === 'requesting') {
        onEvent?.(view, 'stop')
        rejectChunks(view)

        cancelChat()
        normalStatus()
        recoverSelection(view, this.pos)
        this.chatRes = initChatRes
      } else {
        form.requestSubmit()
      }
    }
    closeIcon.onclick = () => {
      onEvent?.(view, 'close')
      normalStatus()
      cancelChat()

      if (isUnifiedMergeViewActive(view.state)) {
        rejectChunks(view)
        recoverSelection(view, this.pos)
      }

      unloadPromptPlugins(view)
      view.focus()
    }
    acceptBtn.onclick = () => {
      onEvent?.(view, 'accept', this.chatRes)
      unloadPromptPlugins(view)

      moveCursorAfterAccept(view)
      view.focus()
    }
    discardBtn.onclick = () => {
      onEvent?.(view, 'reject', {
        prompt: this.inputPrompt,
        ...this.chatRes
      })
      rejectChunks(view)
      recoverSelection(view, this.pos)
      unloadPromptPlugins(view)
      view.focus()
    }
    genBtn.onclick = async () => {
      this.chatRes = initChatRes
      const start = Date.now()
      await handleRequest()
      onEvent?.(view, 'regenerate', {
        prompt: this.inputPrompt,
        ...this.chatRes,
        duration: Date.now() - start
      })
    }

    //----

    setTimeout(() => {
      const end = input.value.length
      input.setSelectionRange(end, end)
      input.focus()

      if (!getCurDatabase(view.state)) {
        onEvent?.(view, 'use_db.open')
        noUseDBStatus()
        return
      }

      if (this.immediate) {
        form.requestSubmit()
      }

      // init input status when the widget is updated, aka, toDOM is re-run
      if (this.status === 'normal') {
        normalStatus()
      } else if (this.status === 'nodb-error') {
        noUseDBStatus()
      } else if (this.status === 'requesting') {
        requestingStatus()
      } else if (this.status === 'req-success') {
        reqSuccessStatus()
      } else if (this.status === 'req-error') {
        reqErrorStatus(this.chatRes.message)
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
