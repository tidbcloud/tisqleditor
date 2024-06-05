// Ref:
// - https://codemirror.net/examples/styling
// - https://github.com/uiwjs/react-codemirror/blob/master/themes/theme/src/index.tsx

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

export const bbeditTheme = EditorView.theme(
  {
    // base
    '&': {
      color: '#000000',
      backgroundColor: '#FFFFFF'
    },

    // caret: insert cursor color
    '.cm-content': {
      caretColor: '#009AE5'
    },
    '&.cm-focused .cm-cursor': {
      borderLeftColor: '#009AE5'
    },

    // ai insert
    '&.ͼ1.cm-merge-b .cm-changedLine': {
      backgroundColor: '#EEFAF2'
    },

    // ai delete
    '&.ͼ1 .cm-deletedChunk': {
      backgroundColor: '#FDEFEF'
    },
    '&.ͼ1 .cm-deletedChunk ::selection': {
      backgroundColor: '#FDEFEF'
    },

    // selection
    '&.ͼ2.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
      backgroundColor: '#E7F7FE'
    },

    '&.ͼ2 .cm-selectionBackground': {
      backgroundColor: '#E7F7FE'
    },

    '& .cm-selectionMatch': {
      backgroundColor: '#CEEDFC'
    },

    // line highlight
    '.cm-activeLineGutter': {
      backgroundColor: '#0CA6F20D'
    },
    '.cm-activeLine': {
      backgroundColor: '#F5FBFE'
    },

    // gutter
    '.cm-gutters': {
      backgroundColor: '#FFFFFF',
      color: '#999'
    }
  },
  { dark: false }
)

export const bbeditHighlightStyle = HighlightStyle.define([
  {
    tag: [t.meta, t.comment],
    color: '#3BAF6D'
  },
  {
    tag: [t.keyword, t.strong],
    color: '#027DBB'
  },
  {
    tag: [t.number],
    color: '#DF2271'
  },
  {
    tag: [t.string],
    color: '#843FA6'
  },
  {
    tag: [t.variableName],
    color: '#056142'
  },
  {
    tag: [t.escape],
    color: '#40BF6A'
  },
  {
    tag: [t.tagName],
    color: '#2152C4'
  },
  {
    tag: [t.heading],
    color: '#2152C4'
  },
  {
    tag: [t.quote],
    color: '#333333'
  },
  {
    tag: [t.list],
    color: '#C20A94'
  },
  {
    tag: [t.documentMeta],
    color: '#999999'
  },
  {
    tag: [t.function(t.variableName)],
    color: '#1A0099'
  },
  {
    tag: [t.definition(t.typeName), t.typeName],
    color: '#6D79DE'
  }
])

export const bbedit: Extension = [bbeditTheme, syntaxHighlighting(bbeditHighlightStyle)]
