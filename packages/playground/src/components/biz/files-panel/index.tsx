import { FilesActions } from './actions'
import { FilesList } from './list'

export default function FilesPanel() {
  return (
    <div>
      <FilesActions />
      <FilesList />
    </div>
  )
}
