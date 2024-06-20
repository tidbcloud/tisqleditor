import { SchemaActions } from './actions'
import { SchemasTree } from './schemas-tree'

export function SchemasPanel() {
  return (
    <div>
      <SchemaActions />
      <SchemasTree />
    </div>
  )
}
