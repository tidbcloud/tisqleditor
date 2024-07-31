import { Panels } from './panels'
import { QueryProvider } from '@/contexts/query-provider'
import { StatementProvider } from '@/contexts/statement-context-provider'
import { SchemaProvider } from '@/contexts/schema-context-provider'
import { FilesProvider } from '@/contexts/files-context-provider'
import { ChatProvider } from '@/contexts/chat-context-provider'
import { EditorProvider } from '@/contexts/editor-cache-provider'

export default function Page() {
  return (
    <QueryProvider>
      <EditorProvider>
        <StatementProvider>
          <SchemaProvider>
            <FilesProvider>
              <ChatProvider>
                <main className="h-screen">
                  <Panels />
                </main>
              </ChatProvider>
            </FilesProvider>
          </SchemaProvider>
        </StatementProvider>
      </EditorProvider>
    </QueryProvider>
  )
}
