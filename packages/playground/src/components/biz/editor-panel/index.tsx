import { EditorActions } from './actions'
import { Editor } from './editor'
import { OpenedFilesTabs } from './opened-files'

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
