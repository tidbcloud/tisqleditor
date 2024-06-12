import { SQLConfig } from '@codemirror/lang-sql'
import { search } from '@codemirror/search'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

import {
  BasicSetupOptions,
  basicSetup
} from '@tidbcloud/tisqleditor-extensions-basic-setup'
import {
  sqlParser,
  getSqlStatements,
  getNearbyStatement
} from '@tidbcloud/tisqleditor-extensions-sql-parser'
import { langSql } from '@tidbcloud/tisqleditor-extensions-lang-sql'
import {
  curSql,
  getCurStatements
} from '@tidbcloud/tisqleditor-extensions-cur-sql'

export class SQLEditorInstance {
  constructor(
    public editor: EditorView,
    public themeCompartment: Compartment,
    public sqlCompartment: Compartment,
    public extraData: {}
  ) {}

  changeTheme(theme: Extension) {
    if (this.themeCompartment.get(this.editor.state) === theme) return

    this.editor.dispatch({
      effects: this.themeCompartment.reconfigure(theme)
    })
  }

  changeSQLConfig(sqlConfig: SQLConfig) {
    this.editor.dispatch({
      effects: this.sqlCompartment.reconfigure(langSql(sqlConfig))
    })
  }

  getAllStatements() {
    return getSqlStatements(this.editor.state)
  }

  getCurStatements() {
    return getCurStatements(this.editor.state)
  }

  getNearbyStatement() {
    const { from } = this.getCurStatements()[0]
    return getNearbyStatement(this.editor.state, from)
  }
}

export type CreateSQLEditorOptions = {
  doc: string

  basicSetupOptions?: BasicSetupOptions
  sqlConfig?: SQLConfig

  theme?: Extension
  extraExts?: Extension

  extraData?: {}
}

export const createSQLEditorInstance = ({
  doc,
  basicSetupOptions = {},
  sqlConfig = {},
  theme = [],
  extraExts = [],
  extraData = {}
}: CreateSQLEditorOptions) => {
  const themeCompartment = new Compartment()
  const sqlCompartment = new Compartment()

  const extensions = [
    basicSetup({
      foldGutter: false,
      foldKeymap: false,
      searchKeymap: true,
      autocompletion: false,
      ...basicSetupOptions
    }),
    search({
      top: true
    }),
    themeCompartment.of(theme),
    sqlCompartment.of(langSql(sqlConfig)),
    sqlParser(),
    curSql(),
    extraExts
  ]
  const editor = new EditorView({
    state: EditorState.create({
      doc,
      extensions
    })
  })
  const editorInst = new SQLEditorInstance(
    editor,
    themeCompartment,
    sqlCompartment,
    extraData
  )
  return editorInst
}
