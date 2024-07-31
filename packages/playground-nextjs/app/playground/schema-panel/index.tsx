import { SchemaActions } from './actions'
import { SchemaTree } from './schema-tree'

export function SchemaPanel() {
  return (
    <div>
      <SchemaActions />
      <SchemaTree />
    </div>
  )
}
