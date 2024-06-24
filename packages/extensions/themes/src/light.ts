import { tags as t } from '@lezer/highlight'

import { CreateThemeOptions, createTheme } from './theme-utils'

export const defaultLightSettings: CreateThemeOptions['settings'] = {
  background: '#FFFFFF',
  color: '#000000',
  caret: '#009AE5',
  selection: '#E7F7FE',
  selectionMatch: '#CEEDFC',
  gutterBackground: '#FFFFFF',
  gutterColor: '#999',
  gutterBorder: 'none',
  lineHighlight: '#F5FBFE',
  gutterActiveForeground: '#0CA6F20D'
}

export const light = ((options?: any) => {
  const { theme = 'light', settings = {}, styles = [] } = options || {}

  return createTheme({
    theme: theme,
    settings: {
      ...defaultLightSettings,
      ...settings
    },
    styles: [
      { tag: [t.meta, t.comment], color: '#3BAF6D' },
      { tag: [t.keyword, t.strong], color: '#027DBB' },
      { tag: [t.number], color: '#DF2271' },
      { tag: [t.string], color: '#843FA6' },
      { tag: [t.variableName], color: '#056142' },
      { tag: [t.escape], color: '#40BF6A' },
      { tag: [t.tagName], color: '#2152C4' },
      { tag: [t.heading], color: '#2152C4' },
      { tag: [t.quote], color: '#333333' },
      { tag: [t.list], color: '#C20A94' },
      { tag: [t.documentMeta], color: '#999999' },
      { tag: [t.function(t.variableName)], color: '#1A0099' },
      { tag: [t.definition(t.typeName), t.typeName], color: '#6D79DE' },
      ...styles
    ]
  })
})()
