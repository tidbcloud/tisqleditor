import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchemaContext } from '@/contexts/schema-context'
import { useSchemaQuery } from '@/hooks/use-schema-loader'

export function SchemaTree() {
  const { schema } = useSchemaContext()
  const { isLoading } = useSchemaQuery()

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    )
  }

  return (
    <Accordion type="multiple" className="w-full">
      {schema?.map((s) => (
        <AccordionItem value={s.name} key={s.name} className="border-b-0">
          <AccordionTrigger className="py-2">{s.name}</AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="ml-4">
              {s.tables.map((t) => (
                <AccordionItem
                  value={t.name}
                  key={t.name}
                  className="border-b-0"
                >
                  <AccordionTrigger className="py-2">{t.name}</AccordionTrigger>
                  <AccordionContent>
                    {t.columns.map((col) => (
                      <div key={col.col}>{col.col}</div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
