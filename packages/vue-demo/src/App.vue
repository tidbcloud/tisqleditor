<script setup lang="ts">
import { ref } from 'vue'

import { SQLEditor, EditorCacheProvide } from '@tidbcloud/tisqleditor-vue'
import { oneDark, bbedit } from '@tidbcloud/codemirror-extension-themes'
import {
  aiWidget,
  isUnifiedMergeViewActive
} from '@tidbcloud/codemirror-extension-ai-widget'
import { curSqlGutter } from '@tidbcloud/codemirror-extension-cur-sql-gutter'
import { sqlAutoCompletion } from '@tidbcloud/codemirror-extension-sql-autocomplete'

import { delay } from './lib/delay'

const isDark = ref(true)
function toggle() {
  isDark.value = !isDark.value
}

const extraExts = [
  aiWidget({
    chat: async () => {
      await delay(2000)
      return {
        status: 'success',
        message:
          'select * from test;\n-- the data is mocked, replace by your own api when using'
      }
    },
    cancelChat: () => {},
    getDbList: () => {
      return ['test1', 'test2']
    }
  }),
  sqlAutoCompletion(),
  curSqlGutter({
    whenHide(view) {
      return isUnifiedMergeViewActive(view.state)
    }
  })
]
</script>

<template>
  <EditorCacheProvide>
    <h2>TiSQLEditor Vue Component Demo</h2>
    <button @click="toggle">
      toggle theme: {{ isDark ? 'dark' : 'light' }}
    </button>

    <SQLEditor
      class="editorContainer"
      editorId="test"
      doc="select * from test;"
      :theme="isDark ? oneDark : bbedit"
      :extraExts="extraExts"
    />
  </EditorCacheProvide>
</template>

<style scoped>
.editorContainer {
  height: 400px;
  width: 800px;
  text-align: left;
  margin-top: 16px;
}
</style>
