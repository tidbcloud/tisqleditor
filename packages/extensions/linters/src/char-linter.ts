import { linter, Diagnostic } from '@codemirror/lint'

import { hintEle, linterBaseTheme } from './lint-style'

export interface charLinterConfig {
  title?: string
  message?: string
}

const fullWidthCharChecker = (config: charLinterConfig) =>
  linter((view) => {
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
              return hintEle(config.title || '', config.message || tips)
            }
          })
        }
      }
    })

    return diagnostics
  })

export const fullWidthCharLinter = (config: charLinterConfig = {}) => {
  return [fullWidthCharChecker(config), linterBaseTheme]
}
