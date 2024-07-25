<script setup lang="ts">
import { provide, onUnmounted } from 'vue'
import { EditorCache } from '@tidbcloud/tisqleditor'

const editorCache = new EditorCache()

provide('editor-cache', editorCache)

onUnmounted(() => {
  editorCache.clearEditors()
})
</script>

<template>
  <slot />
</template>
