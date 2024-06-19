import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

import { Panels } from '@/components/biz/panels'
import { ThemeProvider } from '@/components/darkmode-toggle/theme-provider'
import { StatementProvider } from '@/contexts/statement-context-provider'
import { FilesProvider } from '@/contexts/files-context-provider'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilesProvider>
        <EditorCacheProvider>
          <ThemeProvider>
            <StatementProvider>
              <Panels />
            </StatementProvider>
          </ThemeProvider>
        </EditorCacheProvider>
      </FilesProvider>
    </QueryClientProvider>
  )
}

export default App
