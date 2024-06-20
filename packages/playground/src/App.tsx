import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

import { Panels } from '@/components/biz/panels'
import { ThemeProvider } from '@/components/darkmode-toggle/theme-provider'
import { StatementProvider } from '@/contexts/statement-context-provider'
import { FilesProvider } from '@/contexts/files-context-provider'
import { SchemaProvider } from '@/contexts/schema-context-provider'

const queryClient = new QueryClient()

function App() {
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

export default App
