import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

import { Panels } from '@/components/biz/panels'
import { ThemeProvider } from '@/components/darkmode-toggle/theme-provider'
import { StatementProvider } from '@/contexts/statement-context-provider'
import { FilesProvider } from '@/contexts/files-context-provider'
import { SchemaProvider } from '@/contexts/schema-context-provider'

import { EditorExample } from '@/examples/editor-example'

const queryClient = new QueryClient()

function Full() {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorCacheProvider>
        <ThemeProvider>
          <StatementProvider>
            <SchemaProvider>
              <FilesProvider>
                <Panels />
              </FilesProvider>
            </SchemaProvider>
          </StatementProvider>
        </ThemeProvider>
      </EditorCacheProvider>
    </QueryClientProvider>
  )
}

function App() {
  const params = new URLSearchParams(window.location.search)
  const example = params.get('example')
  const isDark = params.get('theme') === 'dark'

  if (example !== null) {
    return (
      <EditorCacheProvider>
        <EditorExample example={example} isDark={isDark} />
      </EditorCacheProvider>
    )
  }

  return <Full />
}

export default App
