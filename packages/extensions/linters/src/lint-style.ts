import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

export const linterBaseTheme: Extension = EditorView.baseTheme({
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

export const hintEle = (title?: string, content?: string) => {
  const ele = document.createDocumentFragment()
  const titleEle = document.createElement('div')
  titleEle.textContent = title ?? ''
  titleEle.className = 'linter-tooltip-title'
  ele.appendChild(titleEle)

  const tips = document.createElement('div')
  tips.textContent = content ?? ''
  tips.className = 'linter-tooltip-content'
  ele.appendChild(tips)
  return ele
}
