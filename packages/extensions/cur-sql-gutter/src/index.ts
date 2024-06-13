import { RangeSet } from '@codemirror/state'
import { EditorView, gutter, GutterMarker } from '@codemirror/view'
import { getCurStatements } from '@tidbcloud/tisqleditor-extensions-cur-sql'
import { getNearbyStatement } from '@tidbcloud/tisqleditor-extensions-sql-parser'

export interface CurSqlGutterConfig {
  backgroundColor?: string
  width?: number
  className?: string
  shouldGutterDisplay?: (view: EditorView) => boolean
}

function getMarkers(
  view: EditorView,
  config: CurSqlGutterConfig,
  curSqlMarker: GutterMarker
) {
  let markers = RangeSet.empty

  // when something happend, hide the gutter
  if (config.shouldGutterDisplay && !config.shouldGutterDisplay(view)) {
    return markers
  }

  let curStatements = getCurStatements(view.state)
  if (curStatements[0].content === '') {
    const nearby = getNearbyStatement(view.state, curStatements[0].from)
    if (nearby) {
      curStatements = [nearby]
    } else {
      return markers
    }
  }

  try {
    const startPos: number[] = []
    curStatements.forEach((s) => {
      for (let i = s.lineFrom; i <= s.lineTo; i++) {
        const l = view.state.doc.line(i)
        startPos.push(l.from)
      }
    })
    const startPosSet = [...new Set(startPos)]
    startPosSet.forEach(
      (pos) => (markers = markers.update({ add: [curSqlMarker.range(pos)] }))
    )
  } catch (error) {
    console.log('cur-sql-gutter', error)
  }

  return markers
}

/**
 * gutter style
 */
const baseTheme = (config: CurSqlGutterConfig) => {
  return EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      width: config.width || '2px'
    },
    '.cm-lineNumbers .cm-gutterElement': {
      paddingRight: '8px'
    }
  })
}

const sqlGutter = (config: CurSqlGutterConfig, curSqlMarker: GutterMarker) => {
  return gutter({
    class: `cm-sql-gutter ${config.className || ''}`,
    initialSpacer: () => curSqlMarker,
    markers: (view: EditorView) => getMarkers(view, config, curSqlMarker)
  })
}

export const curSqlGutter = (config: CurSqlGutterConfig) => {
  const curSqlMarker = new (class extends GutterMarker {
    toDOM() {
      const el = document.createElement('div')
      el.style.background = config.backgroundColor || '#0CA6F2'
      el.style.height = '100%'
      return el
    }
  })()

  return [baseTheme(config), sqlGutter(config, curSqlMarker)]
}
