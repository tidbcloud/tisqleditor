import { linter, Diagnostic } from '@codemirror/lint'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export interface GrammerCheckConfig {
  title?: string
  content?: string
}

export interface RegexpItem {
  reg: RegExp
  title: string
  message: string
}

const linterBaseTheme: Extension = EditorView.baseTheme({
  '.cm-tooltip-hover': {
    marginTop: '4px',
    borderRadius: '8px'
  },
  '&light .cm-tooltip-hover': {
    border: '1px solid #EDEDED'
  },
  '&dark .cm-tooltip.cm-tooltip-hover': {
    border: '1px solid #393939',
    backgroundColor: '#222'
  },
  '&light .cm-tooltip.cm-tooltip-hover .linter-tooltip-content': {
    color: '#851D38'
  },
  '&dark .cm-tooltip.cm-tooltip-hover .linter-tooltip-content': {
    color: '#f08d83'
  },
  '.cm-tooltip-hover .cm-diagnostic': {
    borderLeft: 'none'
  },
  '.cm-tooltip-hover .linter-tooltip-title': {
    margin: '8px 4px 4px',
    fontWeight: 600,
    color: '#851D38'
  },
  '.cm-tooltip-hover .linter-tooltip-content': {
    margin: '0 4px 8px',
    width: '360px',
    fontSize: 12,
    lineHeight: '18px'
  },
  '.cm-tooltip-hover a': {
    fontWeight: 600
  }
})

const hintEle = (title?: string, content?: string) => {
  const ele = document.createDocumentFragment()
  const titleEle = document.createElement('div')
  titleEle.textContent = title ?? 'Invalid Character'
  titleEle.className = 'linter-tooltip-title'
  ele.appendChild(titleEle)

  const tips = document.createElement('div')
  tips.innerHTML = `<div>${content}</div>`
  tips.className = 'linter-tooltip-content'
  ele.appendChild(tips)
  return ele
}

const chineseCharacterCheckParser = (config: GrammerCheckConfig) => {
  return linter((view) => {
    const diagnostics: Diagnostic[] = []
    view.visibleRanges.forEach((range) => {
      const content = view.state.sliceDoc(range.from, range.to)
      for (let i = 0; i < content.length; i++) {
        const char = content.charAt(i)
        // unicode: /[\u0080-\uFFFF]/
        if (char.charCodeAt(0) >= 0x80) {
          diagnostics.push({
            from: range.from + i,
            to: range.from + i + 1,
            severity: 'error',
            message: '',
            renderMessage: () => {
              const codeNum = char.charCodeAt(0) - 65248
              const tips =
                codeNum > 0
                  ? `The character "${char}" could be confused with "${String.fromCharCode(
                      codeNum
                    )}", which is more common in source code.`
                  : 'The character is invalid.'
              return hintEle(config.title || '', config.content || tips)
            }
          })
        }
      }
    })

    return diagnostics
  })
}

const regexMatchParser = (regs: RegexpItem[]) => {
  return linter((view) => {
    const diagnostics: Diagnostic[] = []
    view.visibleRanges.forEach((range) => {
      const content = view.state.sliceDoc(range.from, range.to)
      const matches: {
        title: string
        message: string
        matchArr: RegExpMatchArray
      }[] = []

      regs.forEach((reg) => {
        const cur = [...Array.from(content.matchAll(reg.reg))]
        matches.push(
          ...cur.map((item) => ({
            title: reg.title,
            message: reg.message,
            matchArr: item
          }))
        )
      })

      matches.forEach((match) => {
        const { index } = match.matchArr
        if (index !== undefined) {
          diagnostics.push({
            from: index,
            to: index + match.matchArr[0].length,
            severity: 'error',
            renderMessage: () => {
              return hintEle(match.title, match.message)
            },
            message: ''
          })
        }
      })
    })

    return diagnostics
  })
}

export const chineseCharacterLinter = (config: GrammerCheckConfig) => {
  return [chineseCharacterCheckParser(config), linterBaseTheme]
}

export const regexMatchLinter = (config: RegexpItem[]) => {
  return [regexMatchParser(config), linterBaseTheme]
}
