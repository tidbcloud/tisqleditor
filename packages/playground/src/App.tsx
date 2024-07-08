import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

import { Panels } from '@/components/biz/panels'
import { ThemeProvider } from '@/components/darkmode-toggle/theme-provider'
import { StatementProvider } from '@/contexts/statement-context-provider'
import { FilesProvider } from '@/contexts/files-context-provider'
import { SchemaProvider } from '@/contexts/schema-context-provider'

import { EditorExample } from '@/examples/editor-example'
import { ChatProvider } from './contexts/chat-context-provider'
import { EditorExampleWithSelect } from './examples/editor-example-with-select'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function FullFeaturedPlayground() {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorCacheProvider>
        <ThemeProvider defaultTheme="dark">
          <StatementProvider>
            <SchemaProvider>
              <FilesProvider>
                <ChatProvider>
                  <Panels />
                </ChatProvider>
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
  const withSelect = params.get('with_select')

  const editorTheme = params.get('theme') ?? 'oneDark'

  if (example !== null) {
    if (withSelect !== null) {
      return (
        <ThemeProvider>
          <EditorExampleWithSelect
            defExample={example}
            defTheme={editorTheme}
          />
        </ThemeProvider>
      )
    }

    return (
      <EditorExample
        example={example}
        withSelect={withSelect}
        theme={editorTheme}
      />
    )
  }

  return <FullFeaturedPlayground />
}

export default App
