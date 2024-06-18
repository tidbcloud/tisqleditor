import { ensureSyntaxTree } from '@codemirror/language'
import { StateField, StateEffect, EditorState } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'

export type SqlStatement = {
  from: number
  to: number
  lineFrom: number
  lineTo: number
  content: string
  database: string
  type: 'use' | 'ddl' | 'other'
}

// state effect
const statementsEffect = StateEffect.define<SqlStatement[]>()

// state field
const statementsField = StateField.define<SqlStatement[]>({
  create() {
    return []
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(statementsEffect)) {
        return effect.value
      }
    }
    return value
  }
})

// regex to match use statement
// examples:
// - use test;
// - USE `test`;
// - use 'test';
// - use "test";
export const useStatementRegex = /^use\s+[`]?([a-zA-Z0-9_-]+)[`]?\s*;$/i
const ddlStatementRegex =
  /^(create|drop|alter|truncate|rename|comment|grant|revoke)/i

// event listener
const statementsParser = () => {
  let first = true

  return EditorView.updateListener.of((v: ViewUpdate) => {
    if (first) {
      first = false
    } else {
      if (!v.docChanged && !v.viewportChanged) return
    }
    const { state } = v
    const statements: SqlStatement[] = []
    let database = ''

    // syntaxTree() only parse the content in the visible area
    // syntaxTree(state)
    ensureSyntaxTree(state, v.view.viewport.to, 1 * 1000)
      ?.cursor()
      .iterate((node) => {
        if (node.name === 'Script') {
          // root node
          return true
        }
        if (node.name === 'Statement') {
          let type: SqlStatement['type'] = 'other'
          const content = state.sliceDoc(node.from, node.to)
          const match = content.match(useStatementRegex)
          if (match) {
            database = match[1]
            type = 'use'
          } else if (content.match(ddlStatementRegex)) {
            type = 'ddl'
          }

          const lineFrom = state.doc.lineAt(node.from)
          const lineTo = state.doc.lineAt(node.to)
          statements.push({
            from: node.from,
            to: node.to,
            lineFrom: lineFrom.number,
            lineTo: lineTo.number,
            content,
            database,
            type
          })
        }
        return true
      })

    v.view.dispatch({ effects: statementsEffect.of(statements) })
  })
}

//-------------------

export function getSqlStatements(state: EditorState) {
  return state.field(statementsField)
}

export function getNearbyStatement(state: EditorState, pos: number) {
  const allStatements = getSqlStatements(state)
  let target: SqlStatement | undefined

  // find the nearest statement before the pos
  for (let i = allStatements.length - 1; i >= 0; i--) {
    const s = allStatements[i]
    if (s.to <= pos) {
      target = s
      break
    }
  }

  // if no statement found, choose the first statement
  if (!target && allStatements.length > 0) {
    target = allStatements[0]
  }

  return target
}

//-------------------

export function sqlParser() {
  return [statementsField, statementsParser()]
}
