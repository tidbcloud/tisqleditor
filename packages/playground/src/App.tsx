import { Panels } from '@/components/biz/panels'
import { FilesProvider } from '@/contexts/files-context-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EditorCacheProvider } from '@tidbcloud/tisqleditor-react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilesProvider>
        <EditorCacheProvider>
          <Panels />
        </EditorCacheProvider>
      </FilesProvider>
    </QueryClientProvider>
  )
}

export default App
