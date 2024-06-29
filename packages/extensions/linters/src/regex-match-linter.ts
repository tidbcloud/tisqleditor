import { Extension } from '@codemirror/state'
import { linter, Diagnostic } from '@codemirror/lint'

import { hintEle, linterBaseTheme } from './lint-style'

export interface RegexpItem {
  reg: RegExp
  title: string
  message: string
}

const regexMatchParser = (regs: RegexpItem[]) =>
  linter((view) => {
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

export function regexMatchLinter(config: RegexpItem[]): Extension {
  return [regexMatchParser(config), linterBaseTheme]
}
