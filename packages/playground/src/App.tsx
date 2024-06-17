import { Panels } from '@/components/biz/panels'
import { FilesProvider } from '@/contexts/files-context-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FilesProvider>
        <Panels />
      </FilesProvider>
    </QueryClientProvider>
  )
}

export default App
