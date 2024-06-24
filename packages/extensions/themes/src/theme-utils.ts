import { EditorView } from '@codemirror/view'
import { Extension } from '@codemirror/state'
import {
  HighlightStyle,
  TagStyle,
  syntaxHighlighting
} from '@codemirror/language'
import { StyleSpec } from 'style-mod'

export interface CreateThemeOptions {
  /**
   * Theme inheritance. Determines which styles CodeMirror will apply by default.
   */
  theme: Theme
  /**
   * Settings to customize the look of the editor, like background, gutter, selection and others.
   */
  settings: Settings
  /** Syntax highlighting styles. */
  styles: TagStyle[]
}

type Theme = 'light' | 'dark'

export interface Settings {
  /** Editor background color. */
  background?: string
  /** Editor background image. */
  backgroundImage?: string
  /** Default text color. */
  color?: string
  /** Caret color. */
  caret?: string
  /** Selection background. */
  selection?: string
  /** Selection match background. */
  selectionMatch?: string
  /** Search match background. */
  searchMatch?: string
  /** Background of highlighted lines. */
  lineHighlight?: string
  /** Gutter background. */
  gutterBackground?: string
  /** Text color inside gutter. */
  gutterColor?: string
  /** Text active color inside gutter. */
  gutterActiveForeground?: string
  /** Gutter right border color. */
  gutterBorder?: string
  /** editor font */
  fontFamily?: string
  /** editor font size */
  fontSize?: StyleSpec['fontSize']
  /** tooltip card background */
  tooltipBackground?: string
  /** tooltip card border style */
  tooltipBorder?: string
  /** autocomplte dropdown active item background */
  autocompleteActiveBackground?: string
  /** autocomplte dropdown active item color */
  autocompleteActiveColor?: string
}

export const createTheme = ({
  theme,
  settings = {},
  styles = []
}: CreateThemeOptions): Extension => {
  const themeOptions: Record<string, StyleSpec> = {
    '.cm-gutters': {}
  }
  const baseStyle: StyleSpec = {}
  if (settings.background) {
    baseStyle.backgroundColor = settings.background
  }
  if (settings.backgroundImage) {
    baseStyle.backgroundImage = settings.backgroundImage
  }
  if (settings.color) {
    baseStyle.color = settings.color
  }
  if (settings.fontSize) {
    baseStyle.fontSize = settings.fontSize
  }
  if (settings.background || settings.color) {
    themeOptions['&'] = baseStyle
  }

  if (settings.fontFamily) {
    themeOptions['&.cm-editor .cm-scroller'] = {
      fontFamily: settings.fontFamily
    }
  }

  if (settings.caret) {
    themeOptions['.cm-content'] = {
      caretColor: settings.caret
    }
    themeOptions['.cm-cursor, .cm-dropCursor'] = {
      borderLeftColor: settings.caret
    }
  }

  if (settings.selection) {
    themeOptions[
      '&.cm-focused .cm-selectionBackground, & .cm-line::selection, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection'
    ] = {
      background: settings.selection + ' !important'
    }
  }

  if (settings.selectionMatch) {
    themeOptions['& .cm-selectionMatch'] = {
      backgroundColor: settings.selectionMatch
    }
  }

  if (settings.searchMatch) {
    themeOptions['.cm-searchMatch.cm-searchMatch-selected'] = {
      backgroundColor: settings.searchMatch
    }
  }

  if (settings.gutterBackground) {
    themeOptions['.cm-gutters'].backgroundColor = settings.gutterBackground
  }
  if (settings.gutterColor) {
    themeOptions['.cm-gutters'].color = settings.gutterColor
  }
  if (settings.gutterBorder) {
    themeOptions['.cm-gutters'].borderRightColor = settings.gutterBorder
  }

  let activeLineGutterStyle: StyleSpec = {}
  if (settings.gutterActiveForeground) {
    activeLineGutterStyle.color = settings.gutterActiveForeground
  }

  if (settings.lineHighlight) {
    themeOptions['.cm-activeLine'] = {
      backgroundColor: settings.lineHighlight
    }
    activeLineGutterStyle.backgroundColor = settings.lineHighlight
  }
  themeOptions['.cm-activeLineGutter'] = activeLineGutterStyle

  if (settings.tooltipBackground || settings.tooltipBorder) {
    const tooltipStyle: StyleSpec = {}
    if (settings.tooltipBackground) {
      tooltipStyle.backgroundColor = settings.tooltipBackground
      themeOptions['.cm-tooltip .cm-tooltip-arrow:after'] = {
        borderTopColor: settings.tooltipBackground,
        borderBottomColor: settings.tooltipBackground
      }
    }
    if (settings.tooltipBorder) {
      tooltipStyle.border = settings.tooltipBorder
    }
    themeOptions['.cm-tooltip'] = tooltipStyle
  }

  themeOptions['.cm-tooltip .cm-tooltip-arrow:before'] = {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent'
  }

  const autocompleteStyle: StyleSpec = {}
  if (settings.autocompleteActiveBackground) {
    autocompleteStyle.backgroundColor = settings.autocompleteActiveBackground
  }
  if (settings.autocompleteActiveColor) {
    autocompleteStyle.color = settings.autocompleteActiveColor
  }
  themeOptions['.cm-tooltip-autocomplete'] = {
    '& > ul > li[aria-selected]': autocompleteStyle
  }

  const themeExtension = EditorView.theme(themeOptions, {
    dark: theme === 'dark'
  })
  const highlightStyle = HighlightStyle.define(styles)
  const extension = [themeExtension, syntaxHighlighting(highlightStyle)]

  return extension
}

export default createTheme
