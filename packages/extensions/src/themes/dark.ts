// Cope from https://github.com/codemirror/theme-one-dark/blob/main/src/one-dark.ts as ref

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = '#e5c07b',
  coral = '#e06c75',
  cyan = '#56b6c2',
  invalid = '#ffffff',
  ivory = '#abb2bf',
  stone = '#7d8799', // Brightened compared to original to increase contrast
  malibu = '#1A0099',
  sage = '#98c379',
  whiskey = '#d19a66',
  violet = '#0ca6f2',
  darkBackground = '#21252b',
  highlightBackground = '#6699ff0b',
  background = '#282c34',
  tooltipBackground = '#353a42',
  selection = '#151C26',
  cursor = '#528bff'

/// The colors used in the theme, as CSS color strings.
export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
}

/// The editor theme styles for One Dark.
export const oneDarkTheme = EditorView.theme(
  {
    '&': {
      color: ivory,
      backgroundColor: background
    },

    '.cm-content': {
      caretColor: cursor
    },

    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: darkBackground, color: ivory },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    // ai delete
    '&.ͼ1 .cm-deletedChunk': {
      backgroundColor: '#4F1B1F'
    },
    '&.ͼ1 .cm-deletedChunk ::selection': {
      backgroundColor: '#4F1B1F'
    },
    // ai insert
    '&.ͼ1.cm-merge-b .cm-changedLine': {
      backgroundColor: '#18462C'
    },

    // selection
    '&.ͼ3.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: '#04365A'
    },

    '&.ͼ3 .cm-selectionBackground': {
      backgroundColor: '#04365A'
    },

    '& .cm-selectionMatch': {
      backgroundColor: '#064470'
    },

    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f'
    },

    '.cm-activeLine': { backgroundColor: '#6699ff0b' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847'
    },

    '.cm-gutters': {
      backgroundColor: background,
      color: stone,
      border: 'none'
    },

    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground
    },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },

    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory
      }
    }
  },
  { dark: true }
)

/// The highlighting style for code in the One Dark theme.
export const oneDarkHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#25AFF4' },
  { tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName], color: coral },
  { tag: [t.function(t.variableName), t.labelName], color: malibu },
  { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
  { tag: [t.definition(t.name), t.separator], color: ivory },
  { tag: [t.typeName, t.className, t.changed, t.annotation, t.modifier, t.self, t.namespace], color: '#8992F5' },
  { tag: [t.number], color: '#D65C99' },
  { tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)], color: cyan },
  { tag: [t.meta, t.comment], color: '#4FB07F' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.heading, color: coral },
  { tag: [t.atom, t.bool, t.special(t.variableName)], color: whiskey },
  { tag: [t.processingInstruction, t.string, t.inserted], color: '#B96CE0' },
  { tag: t.invalid, color: invalid }
])

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const oneDark: Extension = [oneDarkTheme, syntaxHighlighting(oneDarkHighlightStyle)]
