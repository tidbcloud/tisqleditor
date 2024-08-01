<script setup lang="ts">
import { ref } from "vue";
import { SQLEditor, EditorCacheProvide } from "@tidbcloud/tisqleditor-vue";
import { oneDark, bbedit } from "@tidbcloud/codemirror-extension-themes";

const isDark = ref(true);
function toggle() {
  isDark.value = !isDark.value;
}
</script>

<template>
  <EditorCacheProvide>
    <h2>TiSQLEditor Vue Component Demo</h2>
    <button @click="toggle">
      toggle theme: {{ isDark ? "dark" : "light" }}
    </button>

    <SQLEditor
      class="editorContainer"
      editorId="test"
      doc="select * from test;"
      :theme="isDark ? oneDark : bbedit"
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
