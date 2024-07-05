import { ReloadIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSchemaQuery } from '@/hooks/use-schema-loader'

function ReloadButton() {
  const { isFetching, refetch } = useSchemaQuery()

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      onClick={() => refetch()}
      disabled={isFetching}
    >
      <ReloadIcon className={cn('h-4 w-4', { 'animate-spin': isFetching })} />
    </Button>
  )
}

export function SchemaActions() {
  return (
    <div className="flex gap-2 mt-4">
      <ReloadButton />
    </div>
  )
}
