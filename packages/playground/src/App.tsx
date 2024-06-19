import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

import { FilesProvider } from '@/contexts/files-context-provider'
import { Panels } from '@/components/biz/panels'
import { ThemeProvider } from '@/components/darkmode-toggle/theme-provider'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilesProvider>
        <EditorCacheProvider>
          <ThemeProvider>
            <Panels />
          </ThemeProvider>
        </EditorCacheProvider>
      </FilesProvider>
    </QueryClientProvider>
  )
}

export default App
