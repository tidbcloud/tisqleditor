import { ReloadIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { useSchemaContext } from '@/contexts/schema-context'
import { cn } from '@/lib/utils'

function ReloadButton() {
  const { loadSchema } = useSchemaContext()

  const { isFetching, refetch } = useQuery({
    queryKey: ['db_schema'],
    queryFn: loadSchema
  })

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
