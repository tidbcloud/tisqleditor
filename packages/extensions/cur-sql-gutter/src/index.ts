import { RangeSet } from '@codemirror/state'
import { EditorView, gutter, GutterMarker } from '@codemirror/view'
import { getCurStatements } from '@tidbcloud/tisqleditor-extension-cur-sql'
import { getNearbyStatement } from '@tidbcloud/tisqleditor-extension-sql-parser'

export interface CurSqlGutterConfig {
  backgroundColor?: string
  width?: number
  className?: string
  whenHide?: (view: EditorView) => boolean
}

function getMarkers(
  view: EditorView,
  curSqlMarker: GutterMarker,
  config?: CurSqlGutterConfig
) {
  let markers = RangeSet.empty

  // when something happens, hide the gutter
  if (config?.whenHide && config.whenHide(view)) {
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
const baseTheme = (config?: CurSqlGutterConfig) => {
  return EditorView.baseTheme({
    '.cm-sql-gutter .cm-gutterElement': {
      width: `${config?.width ?? 2}px`
    },
    '.cm-lineNumbers .cm-gutterElement': {
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  })
}

const sqlGutter = (curSqlMarker: GutterMarker, config?: CurSqlGutterConfig) => {
  return gutter({
    class: `cm-sql-gutter ${config?.className || ''}`,
    initialSpacer: () => curSqlMarker,
    markers: (view: EditorView) => getMarkers(view, curSqlMarker, config)
  })
}

export const curSqlGutter = (config?: CurSqlGutterConfig) => {
  const curSqlMarker = new (class extends GutterMarker {
    toDOM() {
      const el = document.createElement('div')
      el.style.background = config?.backgroundColor || '#0CA6F2'
      el.style.height = '100%'
      return el
    }
  })()

  return [baseTheme(config), sqlGutter(curSqlMarker, config)]
}
