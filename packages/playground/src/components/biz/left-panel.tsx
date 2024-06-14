import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function LeftPanel() {
  return (
    <div>
      <div className="px-2 py-4">
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          TiSQLEditor Playground
        </h1>
      </div>

      <div className="p-2 pt-0">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Schemas</TabsTrigger>
            <TabsTrigger value="password">SQL Files</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
