import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { LeftPanel } from '@/components/biz/left-panel'
import { EditorPanel } from './editor-panel'

export function Panels() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15} maxSize={30}>
        <LeftPanel />
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={5}>
            {/* <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div> */}
            <EditorPanel />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={25} minSize={5}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
