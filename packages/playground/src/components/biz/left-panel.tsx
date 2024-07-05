import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import FilesPanel from './files-panel'
import { SchemaPanel } from './schema-panel'

export function LeftPanel() {
  return (
    <div>
      <div className="px-2 py-4">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          TiSQLEditor Playground
        </h1>
      </div>

      <div className="p-2 pt-0">
        <Tabs defaultValue="sql-files">
          <TabsList>
            <TabsTrigger value="sql-files">SQL Files</TabsTrigger>
            <TabsTrigger value="schemas">Schemas</TabsTrigger>
          </TabsList>
          <TabsContent value="sql-files">
            <FilesPanel />
          </TabsContent>
          <TabsContent value="schemas">
            <SchemaPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
