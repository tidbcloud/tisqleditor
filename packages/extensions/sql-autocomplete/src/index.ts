import { EditorState, Extension } from '@codemirror/state'
import { EditorView, Rect, keymap } from '@codemirror/view'
import {
  acceptCompletion,
  autocompletion,
  Completion,
  completionStatus,
  CompletionSource
} from '@codemirror/autocomplete'
import { indentLess, indentMore } from '@codemirror/commands'

import {
  Brackets,
  Calendar,
  Functions,
  Database,
  Table,
  Keyword,
  Numberic,
  String,
  Types,
  Variable
} from './icons-svg'

/**
 * The configs of Codemirror Autocomplete
 */
export interface DefaultCompletionConfig {
  /**
    When enabled (defaults to true), autocompletion will start
    whenever the user types something that can be completed.
    */
  activateOnTyping?: boolean
  /**
    When given, if a completion that matches the predicate is
    picked, reactivate completion again as if it was typed normally.
    */
  activateOnCompletion?: (completion: Completion) => boolean
  /**
    The amount of time to wait for further typing before querying
    completion sources via
    [`activateOnTyping`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.activateOnTyping).
    Defaults to 100, which should be fine unless your completion
    source is very slow and/or doesn't use `validFor`.
    */
  activateOnTypingDelay?: number
  /**
    By default, when completion opens, the first option is selected
    and can be confirmed with
    [`acceptCompletion`](https://codemirror.net/6/docs/ref/#autocomplete.acceptCompletion). When this
    is set to false, the completion widget starts with no completion
    selected, and the user has to explicitly move to a completion
    before you can confirm one.
    */
  selectOnOpen?: boolean
  /**
    Override the completion sources used. By default, they will be
    taken from the `"autocomplete"` [language
    data](https://codemirror.net/6/docs/ref/#state.EditorState.languageDataAt) (which should hold
    [completion sources](https://codemirror.net/6/docs/ref/#autocomplete.CompletionSource) or arrays
    of [completions](https://codemirror.net/6/docs/ref/#autocomplete.Completion)).
    */
  override?: readonly CompletionSource[] | null
  /**
    Determines whether the completion tooltip is closed when the
    editor loses focus. Defaults to true.
    */
  closeOnBlur?: boolean
  /**
    The maximum number of options to render to the DOM.
    */
  maxRenderedOptions?: number
  /**
    Set this to false to disable the [default completion
    keymap](https://codemirror.net/6/docs/ref/#autocomplete.completionKeymap). (This requires you to
    add bindings to control completion yourself. The bindings should
    probably have a higher precedence than other bindings for the
    same keys.)
    */
  defaultKeymap?: boolean
  /**
    By default, completions are shown below the cursor when there is
    space. Setting this to true will make the extension put the
    completions above the cursor when possible.
    */
  aboveCursor?: boolean
  /**
    When given, this may return an additional CSS class to add to
    the completion dialog element.
    */
  tooltipClass?: (state: EditorState) => string
  /**
    This can be used to add additional CSS classes to completion
    options.
    */
  optionClass?: (completion: Completion) => string
  /**
    By default, the library will render icons based on the
    completion's [type](https://codemirror.net/6/docs/ref/#autocomplete.Completion.type) in front of
    each option. Set this to false to turn that off.
    */
  icons?: boolean
  /**
    This option can be used to inject additional content into
    options. The `render` function will be called for each visible
    completion, and should produce a DOM node to show. `position`
    determines where in the DOM the result appears, relative to
    other added widgets and the standard content. The default icons
    have position 20, the label position 50, and the detail position
    80.
    */
  addToOptions?: {
    render: (
      completion: Completion,
      state: EditorState,
      view: EditorView
    ) => Node | null
    position: number
  }[]
  /**
    By default, [info](https://codemirror.net/6/docs/ref/#autocomplete.Completion.info) tooltips are
    placed to the side of the selected completion. This option can
    be used to override that. It will be given rectangles for the
    list of completions, the selected option, the info element, and
    the availble [tooltip
    space](https://codemirror.net/6/docs/ref/#view.tooltips^config.tooltipSpace), and should return
    style and/or class strings for the info element.
    */
  positionInfo?: (
    view: EditorView,
    list: Rect,
    option: Rect,
    info: Rect,
    space: Rect
  ) => {
    style?: string
    class?: string
  }
  /**
    The comparison function to use when sorting completions with the same
    match score. Defaults to using
    [`localeCompare`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare).
    */
  compareCompletions?: (a: Completion, b: Completion) => number
  /**
    When set to true (the default is false), turn off fuzzy matching
    of completions and only show those that start with the text the
    user typed. Only takes effect for results where
    [`filter`](https://codemirror.net/6/docs/ref/#autocomplete.CompletionResult.filter) isn't false.
    */
  filterStrict?: boolean
  /**
    By default, commands relating to an open completion only take
    effect 75 milliseconds after the completion opened, so that key
    presses made before the user is aware of the tooltip don't go to
    the tooltip. This option can be used to configure that delay.
    */
  interactionDelay?: number
  /**
    When there are multiple asynchronous completion sources, this
    controls how long the extension waits for a slow source before
    displaying results from faster sources. Defaults to 100
    milliseconds.
    */
  updateSyncTime?: number
}

export interface AutoCompletionConfig extends DefaultCompletionConfig {
  /**
  accept the completion by pressing the key, defult is Tab
  */
  acceptKey?: string
  /**
  the classname added to the auto completion item
  */
  autocompleteItemClassName?: string
  /**
  The maximum number of options to render to the DOM, default is 50
  */
  maxRenderedOptions?: number
  /**
  The icon map for the auto completion item, the key is the type of the completion, the value is the img src
  */
  renderIconMap?: Record<string, string>
}

const baseTheme = EditorView.baseTheme({
  '.cm-tooltip-autocomplete.cm-tooltip': {
    boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.1)',
    border: 'none',
    borderRadius: '8px'
  },
  '.cm-tooltip-autocomplete.cm-tooltip ul': {
    borderRadius: '8px'
  },
  '.cm-tooltip.cm-tooltip-autocomplete .cm-autocomplete-item': {
    lineHeight: '32px',
    padding: '0 16px',
    '&:hover': {
      backgroundColor: `rgba(12, 166, 242, .1)`
    },
    '&[aria-selected]': {
      background: 'rgba(12, 166, 242, .1)',
      color: '#333333'
    }
  },
  '.cm-autocomplete-item': {
    display: 'flex',
    alignItems: 'center'
  },
  '.cm-autocomplete-item > div.icon': {
    marginRight: '10px'
  },
  '.cm-autocomplete-item .cm-completionIcon-keyword': {
    paddingRight: '24px'
  },
  '&light .cm-tooltip-autocomplete.cm-tooltip': {
    backgroundColor: '#fff'
  },
  '&light .cm-autocomplete-item': {
    backgroundColor: '#fff',
    color: '#333333'
  },
  '&dark .cm-tooltip-autocomplete.cm-tooltip': {
    backgroundColor: '#111'
  },
  '&dark .cm-tooltip.cm-tooltip-autocomplete .cm-autocomplete-item': {
    backgroundColor: '#111',
    color: '#e8e8e8',

    '&[aria-selected]': {
      background: 'rgba(12, 166, 242, .1)',
      color: '#e8e8e8'
    }
  }
})

const customAutoCompletion = (config: AutoCompletionConfig) => {
  const { maxRenderedOptions, ...rest } = config
  return autocompletion({
    activateOnTyping: true,
    closeOnBlur: false,
    optionClass: () =>
      `cm-autocomplete-item ${config.autocompleteItemClassName || ''}`,
    icons: false,
    maxRenderedOptions: config.maxRenderedOptions || 50,
    addToOptions: [
      {
        render: (
          completion: Completion,
          _state: EditorState,
          _view: EditorView
        ) => {
          let src = ''
          switch ((completion.type || '').toUpperCase()) {
            case 'KEYWORD':
              src = Keyword
              break
            case 'VARIABLE':
              src = Variable
              break
            case 'TYPE':
              src = Types
              break
            case 'FUNCTION':
            case 'METHOD':
              src = Functions
              break
            case 'TABLE':
              src = Table
              break
            case 'DATABASE':
              src = Database
              break
            case 'BIT':
            case 'BOOLEAN':
            case 'TINYINT':
            case 'SMALLINT':
            case 'MEDIUMINT':
            case 'INTEGER':
            case 'INT':
            case 'BIGINT':
            case 'FLOAT':
            case 'DOUBLE':
            case 'DECIMAL':
            case 'NUMERIC':
              src = Numberic
              break
            case 'CHAR':
            case 'VARCHAR':
            case 'TEXT':
            case 'TINYTEXT':
            case 'MEDIUMTEXT':
            case 'LONGTEXT':
            case 'BINARY':
            case 'VARBINARY':
            case 'BLOB':
            case 'TINYBLOB':
            case 'MEDIUMBLOB':
            case 'LONGBLOB':
            case 'ENUM':
            case 'SET':
              src = String
              break
            case 'DATE':
            case 'TIME':
            case 'DATETIME':
            case 'TIMESTAMP':
            case 'YEAR':
              src = Calendar
              break
            case 'JSON':
              src = Brackets
              break
          }

          if (
            completion.type &&
            config.renderIconMap &&
            config.renderIconMap[completion.type]
          ) {
            src = config.renderIconMap[completion.type]
          }

          if (src) {
            const element = document.createElement('div')
            element.className = 'icon'
            element.innerHTML = src
            return element
          } else {
            return null
          }
        },
        position: 0
      }
    ],
    ...rest
  })
}

const autoCompleteTab = (config: AutoCompletionConfig) => {
  return keymap.of([
    {
      key: config.acceptKey || 'Tab',
      preventDefault: true,
      shift: indentLess,
      run: (e) => {
        if (!completionStatus(e.state)) return indentMore(e)
        return acceptCompletion(e)
      }
    }
  ])
}

export function sqlAutoCompletion(
  config: AutoCompletionConfig = {}
): Extension {
  return [baseTheme, customAutoCompletion(config), autoCompleteTab(config)]
}
