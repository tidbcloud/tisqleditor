import { tags as t } from '@lezer/highlight'

import { CreateThemeOptions, createTheme } from './theme-utils'

export const defaultSettingsDark: CreateThemeOptions['settings'] = {
  background: '#282c34',
  color: '#abb2bf',
  caret: '#528bff',
  selection: '#151C26',
  selectionMatch: '#064470',
  searchMatch: '#6199ff2f',
  gutterBackground: '#282c34',
  gutterColor: '#7d8799',
  gutterBorder: 'none',
  lineHighlight: '#6699ff0b',
  tooltipBackground: '#353a42',
  tooltipBorder: 'none',
  autocompleteActiveBackground: '#6699ff0b',
  autocompleteActiveColor: '#abb2bf'
}

export const dark = ((options?: any) => {
  const { theme = 'dark', settings = {}, styles = [] } = options || {}

  return createTheme({
    theme: theme,
    settings: {
      ...defaultSettingsDark,
      ...settings
    },
    styles: [
      { tag: t.keyword, color: '#25AFF4' },
      {
        tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
        color: '#e06c75'
      },
      { tag: [t.function(t.variableName), t.labelName], color: '#1A0099' },
      {
        tag: [t.color, t.constant(t.name), t.standard(t.name)],
        color: '#d19a66'
      },
      { tag: [t.definition(t.name), t.separator], color: '#abb2bf' },
      {
        tag: [
          t.typeName,
          t.className,
          t.changed,
          t.annotation,
          t.modifier,
          t.self,
          t.namespace
        ],
        color: '#8992F5'
      },
      { tag: [t.number], color: '#D65C99' },
      {
        tag: [
          t.operator,
          t.operatorKeyword,
          t.url,
          t.escape,
          t.regexp,
          t.link,
          t.special(t.string)
        ],
        color: '#56b6c2'
      },
      { tag: [t.meta, t.comment], color: '#4FB07F' },
      { tag: t.strong, fontWeight: 'bold' },
      { tag: t.heading, color: '#e06c75' },
      { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d19a66' },
      {
        tag: [t.processingInstruction, t.string, t.inserted],
        color: '#B96CE0'
      },
      { tag: t.invalid, color: '#ffffff' },
      ...styles
    ]
  })
})()
