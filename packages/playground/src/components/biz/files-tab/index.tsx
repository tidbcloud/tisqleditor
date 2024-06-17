import { FilesActions } from './actions'
import { FilesList } from './list'

export default function FilesTab() {
  return (
    <div>
      <FilesActions />
      <FilesList />
    </div>
  )
}
