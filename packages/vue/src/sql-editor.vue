<script setup lang="ts">
import { ref, watch, inject, watchEffect } from 'vue'
import {
  CreateSQLEditorOptions,
  createSQLEditorInstance,
  EditorCache
} from '@tidbcloud/tisqleditor'

type SQLEditorProps = CreateSQLEditorOptions & {
  class?: string
}
const props = defineProps<SQLEditorProps>()

const editorContainerRef = ref<HTMLInputElement | null>(null)
const editorCache = inject('editor-cache', new EditorCache())

function editorIdChange(newId: string, oldId: string) {
  if (!editorContainerRef.value) {
    return
  }
  const oldInst = editorCache.getEditor(oldId)
  if (oldInst) {
    editorContainerRef.value.removeChild(oldInst.editorView.dom)
  }
  let newInst = editorCache.getEditor(newId)
  if (!newInst) {
    const { theme, sqlConfig, ...rest } = props
    newInst = createSQLEditorInstance({
      theme,
      sqlConfig,
      ...rest,
      editorId: newId
    })
    editorCache.addEditor(newId, newInst)
  }
  editorContainerRef.value.appendChild(newInst.editorView.dom)
  newInst.editorView.focus()
}
editorIdChange(props.editorId, '')

watch(() => props.editorId, editorIdChange)

watchEffect(() => {
  editorCache.getEditor(props.editorId)?.changeTheme(props.theme ?? [])
})

watchEffect(() => {
  editorCache.getEditor(props.editorId)?.changeSQLConfig(props.sqlConfig ?? {})
})
</script>

<template>
  <div :class="class" ref="editorContainerRef"></div>
</template>
