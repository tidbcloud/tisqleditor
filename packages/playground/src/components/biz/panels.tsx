import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import { LeftPanel } from '@/components/biz/left-panel'
import { EditorPanel } from '@/components/biz/editor-panel'
import { ResultPanel } from '@/components/biz/result-panel'

export function Panels() {
  const params = new URLSearchParams(window.location.search)
  const hidden = params.get('hidden')

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={hidden ? 0 : 15} maxSize={hidden ? 0 : 30}>
        <LeftPanel />
      </ResizablePanel>

      {!hidden && <ResizableHandle withHandle />}

      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={75} minSize={5}>
            <EditorPanel />
          </ResizablePanel>

          {!hidden && (
            <>
              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={25} minSize={5}>
                <ResultPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
