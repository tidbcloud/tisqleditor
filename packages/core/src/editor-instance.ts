import { EditorView } from '@codemirror/view'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { SQLConfig, sql, MySQL } from '@codemirror/lang-sql'

import {
  BasicSetupOptions,
  basicSetup
} from '@tidbcloud/codemirror-extension-basic-setup'
import {
  sqlParser,
  getSqlStatements,
  getNearbyStatement
} from '@tidbcloud/codemirror-extension-sql-parser'
import {
  curSql,
  getCurStatements
} from '@tidbcloud/codemirror-extension-cur-sql'

const langSql = (config: SQLConfig) =>
  sql({
    dialect: MySQL,
    upperCaseKeywords: true,
    ...config
  })

export class SQLEditorInstance {
  constructor(
    public editorId: string,
    public editorView: EditorView,
    public themeCompartment: Compartment,
    public sqlCompartment: Compartment,
    public extraData: {}
  ) {}

  changeTheme(theme: Extension) {
    if (this.themeCompartment.get(this.editorView.state) === theme) return

    this.editorView.dispatch({
      effects: this.themeCompartment.reconfigure(theme)
    })
  }

  changeSQLConfig(sqlConfig: SQLConfig) {
    this.editorView.dispatch({
      effects: this.sqlCompartment.reconfigure(langSql(sqlConfig))
    })
  }

  getAllStatements() {
    return getSqlStatements(this.editorView.state)
  }

  getCurStatements() {
    return getCurStatements(this.editorView.state)
  }

  getNearbyStatement() {
    const { from } = this.getCurStatements()[0]
    return getNearbyStatement(this.editorView.state, from)
  }
}

export type CreateSQLEditorOptions = {
  editorId: string
  doc: string

  basicSetupOptions?: BasicSetupOptions
  sqlConfig?: SQLConfig

  theme?: Extension
  extraExts?: Extension

  extraData?: {}
}

export const createSQLEditorInstance = ({
  editorId,
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
    // make it full height default
    // you can override it by theme and extraExts
    EditorView.theme({
      '&': { height: '100%' },
      '.cm-line': {
        paddingLeft: '8px'
      }
    }),

    basicSetup({
      foldGutter: false,
      foldKeymap: false,
      searchKeymap: true,
      autocompletion: false,
      ...basicSetupOptions
    }),

    themeCompartment.of(theme),
    sqlCompartment.of(langSql(sqlConfig)),

    sqlParser(),
    curSql(),

    extraExts
  ]
  const editorView = new EditorView({
    state: EditorState.create({
      doc,
      extensions
    })
  })
  const editorInst = new SQLEditorInstance(
    editorId,
    editorView,
    themeCompartment,
    sqlCompartment,
    extraData
  )
  return editorInst
}
