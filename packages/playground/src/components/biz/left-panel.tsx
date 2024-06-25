import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FilesPanel from './files-panel'
import { SchemasPanel } from './schemas-panel'

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
            <TabsTrigger value="schemas">Schemas</TabsTrigger>
            <TabsTrigger value="sql-files">SQL Files</TabsTrigger>
          </TabsList>
          <TabsContent value="schemas">
            <SchemasPanel />
          </TabsContent>
          <TabsContent value="sql-files">
            <FilesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
