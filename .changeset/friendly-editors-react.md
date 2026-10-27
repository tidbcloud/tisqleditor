---
'@tidbcloud/tisqleditor-react': minor
'@tidbcloud/tisqleditor': patch
---

Support React 18.3 and React 19, with a compatibility matrix for runtime behavior and React types. Safely detach editor DOM during cleanup and destroy CodeMirror views when their owning cache deletes or clears them, including StrictMode effect replay. Cached documents remain available when switching files within a mounted provider.
