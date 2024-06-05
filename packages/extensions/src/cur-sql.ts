import { StateField, StateEffect, EditorState } from '@codemirror/state'
import { EditorView, ViewUpdate } from '@codemirror/view'

import { SqlStatement, getSqlStatements } from './sql-parser'

// state effect
const curStatementsEffect = StateEffect.define<SqlStatement[]>()

// state field
const curStatementsField = StateField.define<SqlStatement[]>({
  create() {
    return [{ from: 0, to: 0, lineFrom: 1, lineTo: 1, content: '', database: '', type: 'other' }]
  },
  update(value, tr) {
    for (let effect of tr.effects) {
      if (effect.is(curStatementsEffect)) {
        return effect.value
      }
    }
    return value
  }
})

// event listener
const curStatements = () => {
  let first = true

  return EditorView.updateListener.of((v: ViewUpdate) => {
    if (first) {
      first = false
    } else {
      if (!v.selectionSet) return
    }
    const { state } = v.view
    const { from, to } = state.selection.main

    const selectedStatements: SqlStatement[] = []
    let preDb = ''
    for (const s of getSqlStatements(state)) {
      if (s.to < from) {
        preDb = s.database
        continue
      }
      if (s.from > to) {
        break
      }
      selectedStatements.push({ ...s })
    }

    // if no statement is selected, use a empty statement
    if (selectedStatements.length === 0) {
      const lineFrom = state.doc.lineAt(from)
      const lineTo = state.doc.lineAt(to)
      selectedStatements.push({
        from,
        to,
        lineFrom: lineFrom.number,
        lineTo: lineTo.number,
        content: '',
        database: preDb,
        type: 'other'
      })
    }

    v.view.dispatch({
      effects: curStatementsEffect.of(selectedStatements)
    })
  })
}

//-------------------

export function getCurStatements(state: EditorState) {
  return state.field(curStatementsField)
}

export function getCurDatabase(state: EditorState) {
  const curStatements = getCurStatements(state)
  if (curStatements.length === 0) throw new Error('curStatements must not be empty')
  return curStatements[0].database
}

// AI extension use this function to get the first non-use statement
// if there is no non-use statement, not should the tooltip hint and cmd+i should not work
export function getFirstNonUseTypeStatement(state: EditorState) {
  return getCurStatements(state).find((s) => s.type !== 'use')
}

//-------------------

export function curSql() {
  return [curStatementsField, curStatements()]
}
