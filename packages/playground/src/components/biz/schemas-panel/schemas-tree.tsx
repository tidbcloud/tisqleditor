import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { useSchemaContext } from '@/contexts/schema-context'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

export function SchemasTree() {
  const { loadSchema, schema, setSchema } = useSchemaContext()

  const { data: schemaData, isLoading } = useQuery({
    queryKey: ['db_schema'],
    queryFn: loadSchema
  })
  useEffect(() => {
    setSchema(schemaData ?? null)
  }, [schemaData])

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }

  return (
    <Accordion type="multiple" className="w-full">
      {schema?.map((s) => (
        <AccordionItem value={s.name} key={s.name} className="border-b-0">
          <AccordionTrigger>{s.name}</AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="ml-4">
              {s.tables.map((t) => (
                <AccordionItem
                  value={t.name}
                  key={t.name}
                  className="border-b-0"
                >
                  <AccordionTrigger>{t.name}</AccordionTrigger>
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
