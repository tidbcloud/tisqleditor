import { EditorActions } from './actions'
import { OpenedFilesTabs } from './opened-files'
import { Editor } from './editor'

export function EditorPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none h-12 flex">
        <OpenedFilesTabs />
        <EditorActions />
      </div>
      <div className="flex-auto overflow-auto">
        <Editor />
      </div>
    </div>
  )
}
